#!/usr/bin/env -S npx tsx

import yargs from 'yargs';
import fs, { Dirent, readFileSync } from 'fs';
import path from 'path';
import hash from '../src/utils/hash';
import { slugify } from '../src/utils/slugify';
import type { VaultItem } from '../src/types/VaultItem';

type FileTree = {
    tree: VaultItem[];
    metrics: Record<string, number>;
}

const argv = await yargs(process.argv.slice(2))
    .option('in', { type: 'string', demandOption: true, describe: 'The is the directory where we begin walking the file tree' })
    .option('out', { type: 'string', demandOption: true, describe: 'This is the directory where the filetree and filehash files will be created' })
    .option('treeName', { type: 'string', demandOption: false, describe: 'Use a custom name for the resulting VaultTree.json' })
    .option('hashName', { type: 'string', demandOption: false, describe: 'Use a custom name for the resulting VaultFiles.json' })
    .option('ignore', { type: 'string', describe: 'path to gitignore which will filter the vault' })
    .help()
    .argv;

// We dont want to try to capture any hidden .dotfiles or try to process any files that are in the gitignore
const gitignorePath = argv.ignore || `${argv.in}/.gitignore`;
const gitignoreExists = fs.existsSync(gitignorePath)
const mask = gitignoreExists ? readFileSync(gitignorePath, 'utf8').split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#')).join(' ').trim() : '';
const treeFilepath = path.join(argv.out, argv.treeName || 'VaultTree.json');
const hashFilepath = path.join(argv.out, argv.hashName || 'VaultFiles.json');


if (gitignoreExists) {
    console.log('[ info ]: In addition to ignoring .dotfiles, the following .gitignore rules will be applied (if supported)');
    console.log(mask.split(' '));
}
else {
    console.log('[ info ]: no .gitignore found. will only ignore dotfiles this run.');
}

const filterIgnored = (files: Dirent[]) => {
    return files.filter((file) => {
        if (file.name.startsWith('.')) return false; // no hidden files
        if (mask.includes(file.name)) return false; // no ignored files
        else return true;
    });
};

async function getTargetDirents(targetDir: string, basePath: string = ''): Promise<fs.Dirent[]> {
    const ents = await fs.promises.readdir(targetDir, { withFileTypes: true });
    const filtered = filterIgnored(ents); // remove hidden and ignored files
    const result: fs.Dirent[] = [];
    for (const ent of filtered) {
        const currentPath = path.join(basePath, ent.name);
        result.push(ent);
        if (ent.isDirectory()) {
            const subDirents = await getTargetDirents(path.join(targetDir, ent.name), currentPath);
            result.push(...subDirents);
        }
    }
    return result;
}


const getFileExtension = (filePath: string): string => path.extname(filePath).slice(1);

const buildFileTree = (dirents: Dirent[]): FileTree => {
    const metrics: Record<string, number> = {};
    const root: VaultItem = {
        fileType: 'folder',
        filepath: '',
        id: hash('root'),
        label: '',
        labelSlug: '',
        webPath: '',
        children: []
    };

    for (const ent of dirents) {
        const { name: filename, parentPath } = ent;
        const dirPath = path.relative(argv.in, parentPath);
        const filepath = dirPath ? `${dirPath}/${filename}` : filename;
        const isFile = ent.isFile();
        const isDirectory = ent.isDirectory();
        const isSymlink = ent.isSymbolicLink();

        let node: VaultItem;

        if (isFile) {
            const extension = getFileExtension(filename);
            const label = extension === 'md' ? filename.replace(`.${extension}`, '') : filename;
            const webPath = extension === 'md' ? slugify(filepath.replace(`.${extension}`, '')) : slugify(filepath);
            let stats;
            try { stats = fs.statSync(parentPath + '/' + filename); }
            catch (error) { console.error(`Error getting stats for file ${filepath}:`, error); }

            node = {
                fileType: 'file',
                extension,
                filepath,
                id: hash(filepath),
                label,
                labelSlug: slugify(label),
                webPath,
                mtimeMs: stats.mtimeMs,
            };
        } else if (isDirectory) {
            node = {
                fileType: 'folder',
                filepath,
                id: hash(filepath),
                label: filename,
                labelSlug: slugify(filename),
                webPath: slugify(filepath),
                children: [],
            };
        } else if (isSymlink) {
            node = {
                fileType: 'symlink',
                filepath,
                id: hash(filepath),
                label: filename,
                labelSlug: slugify(filename),
                webPath: slugify(filepath),
                // targetType: undefined, // This can be set later if needed
                extension: undefined, // Only applies if it links to a file
                children: undefined, // Only applies if it links to a folder
            };
        } else {
            continue; // Skip unknown types
        }

        root.children?.push(node);

        // Update Metrics
        metrics[node.fileType] = (metrics[node.fileType] || 0) + 1;
        if ('extension' in node && node.extension) {
            metrics[node.extension] = (metrics[node.extension] || 0) + 1;
        }
    }

    return { tree: root.children || [], metrics };
};


//https://help.obsidian.md/file-formats
const obsidianImageTypes = ['avif', 'bmp', 'gif', 'jpeg', 'jpg', 'png', 'svg', 'webp'];

const buildLookupTable = (tree: VaultItem[]) => {
    const filesByID: Record<string, VaultItem> = {};
    const fileIDForWebPathSlug: Record<string, string> = {};
    const fileIDForLabelSlug: Record<string, string> = {};
    const allImageFileIDs: string[] = [];

    const traverse = (node: VaultItem) => {
        filesByID[node.id] = node;
        fileIDForWebPathSlug[node.webPath] = node.id;
        fileIDForLabelSlug[node.labelSlug] = node.id;

        if (node.fileType === 'file' && obsidianImageTypes.includes(node.extension || '')) {
            allImageFileIDs.push(node.id);
        }

        if (node.fileType === 'folder') {
            node.children?.forEach(traverse);
        }
    };

    tree.forEach(traverse);
    return { filesByID, fileIDForWebPathSlug, fileIDForLabelSlug, allImageFileIDs };
};

const dirents = await getTargetDirents(argv.in).catch((err) => {
    console.error('\n[ Error ] encountered while attempting to map vault files:  ', err, '\n');
    process.exit(1);
});

// Builds a FileTree object from the Dirent[] array first, then we build the hashTable from the tree
const results = buildFileTree(dirents);

fs.writeFileSync(treeFilepath, JSON.stringify(results.tree, null, 2));
console.log(`[ info ]: file tree data has been saved as:    ${treeFilepath}`);

const hashTable = buildLookupTable(results.tree);
fs.writeFileSync(hashFilepath, JSON.stringify(hashTable, null, 2));
console.log(`[ info ]: file hash data has been saved as:    ${hashFilepath}`);