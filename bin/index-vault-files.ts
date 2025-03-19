#!/usr/bin/env -S npx tsx

import yargs from 'yargs';
import fs, { Dirent, readFileSync } from 'fs';
import path from 'path';
import hash from '../src/utils/hash';
import { slugify } from '../src/utils/slugify';
import type { VaultItem } from '../src/types/VaultItem';


type TreeItem = {
    id: string;
    label: string;
    children?: TreeItem[];
}

type VaultIndex = {
    files: Record<string, VaultItem>;
    imageIds: string[];
    idsByWebPath: Record<string, string>;
    idsByLabelSlug: Record<string, string>;
    idsByExtension: Record<string, string[]>;
    stats: Record<string, any>;
    fileTree: TreeItem[];
}


//https://help.obsidian.md/file-formats
const obsidianImageTypes = ['avif', 'bmp', 'gif', 'jpeg', 'jpg', 'png', 'svg', 'webp'];


const argv = await yargs(process.argv.slice(2))
    .option('in', { type: 'string', demandOption: true, describe: 'The directory where file indexing begins. This is usually your obsidian vault.' })
    .option('out', { type: 'string', demandOption: true, describe: 'The directory where the index files will be written.' })
    .option('treeName', { type: 'string', demandOption: false, describe: 'Use a custom name for the resulting obsidious-tree.json' })
    .option('indexName', { type: 'string', demandOption: false, describe: 'Use a custom name for the resulting obsidious-index.json' })
    .option('ignore', { type: 'string', describe: 'path to gitignore which will filter the vault' })
    .help()
    .argv;

// We dont want to try to capture any hidden .dotfiles or try to process any files that are in the gitignore
const gitignorePath = argv.ignore || `${argv.in}/.gitignore`;
const gitignoreExists = fs.existsSync(gitignorePath)
const mask = gitignoreExists ? readFileSync(gitignorePath, 'utf8').split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#')).join(' ').trim() : '';
const treeFilepath = path.join(argv.out, argv.treeName || 'obsidious-tree.json');
const indexFilepath = path.join(argv.out, argv.indexName || 'obsidious-index.json');


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



const indexVault = (dirents: Dirent[]) => {
    const vaultIndex: VaultIndex = {
        files: {},
        imageIds: [],
        idsByWebPath: {},
        idsByLabelSlug: {},
        idsByExtension: {},
        stats: {},
        fileTree: []
    }
    const Tree: TreeItem = { id: hash('root'), label: '', children: [] };

    for (const ent of dirents) {
        const { name: filename, parentPath } = ent;
        const dirPath = path.relative(argv.in, parentPath);
        const filepath = dirPath ? `${dirPath}/${filename}` : filename;
        const isFile = ent.isFile();
        const isDirectory = ent.isDirectory();
        const id = hash(filepath);

        let currentTree = Tree;
        let treeItem: TreeItem;
        let vaultItem: VaultItem;

        let stats;
        try { stats = fs.statSync(parentPath + '/' + filename); }
        catch (error) { console.error(`Error getting stats for file ${filepath}:`, error); }

        filepath.split('/').forEach((part) => {
            const existingChild = currentTree.children?.find((child) => child.label === part);

            if (!existingChild) {
                const extension = isFile ? getFileExtension(filename) : undefined;
                const label = isFile && extension === 'md' ? filename.replace(`.${extension}`, '') : filename;
                const webPath = isFile && extension === 'md' ? slugify(filepath.replace(`.${extension}`, '')) : slugify(filepath);
                const children = isDirectory ? [] : undefined;

                vaultItem = {
                    ...(isFile ? { extension } : {}),
                    ...(children),
                    filepath,
                    fileType: isFile ? 'file' : 'folder',
                    id,
                    label,
                    labelSlug: slugify(label),
                    mtimeMs: stats.mtimeMs,
                    webPath,
                };
                vaultIndex.files[id] = vaultItem;
                vaultIndex.idsByWebPath[vaultItem.webPath] = id;
                vaultIndex.idsByLabelSlug[vaultItem.labelSlug] = id;

                if (extension) {
                    (vaultIndex.idsByExtension[extension] = vaultIndex.idsByExtension[extension] || []).push(id);
                    obsidianImageTypes.includes(extension) && vaultIndex.imageIds.push(id);
                }

                treeItem = isDirectory ? { id, label, children: [] } : { id, label };
                currentTree.children?.push(treeItem);
                if (isDirectory) currentTree = treeItem;

            } else {
                isDirectory && !existingChild.children && (existingChild.children = []);
                currentTree = existingChild;
            }
        });
    }

    vaultIndex.fileTree = Tree.children || [];
    vaultIndex.stats = {
        totalFiles: Object.keys(vaultIndex.files).length,
        totalDirectories: Tree.children?.length || 0,
        totalImages: vaultIndex.imageIds.length,
        fileTypesSummary: Object.entries(vaultIndex.idsByExtension).map(([ext, ids]) => ({ ext, count: ids.length })),

    };

    return { tree: Tree.children, vaultIndex };
};

const dirents = await getTargetDirents(argv.in).catch((err) => {
    console.error('\n[ Error ] encountered while attempting to map vault files:  ', err, '\n');
    process.exit(1);
});

// Builds a FileTree object from the Dirent[] array first, then we build the hashTable from the tree
const { tree, vaultIndex } = indexVault(dirents);

fs.writeFileSync(treeFilepath, JSON.stringify(tree, null, 2));
console.log(`[ info ]: vault files tree data has been saved as:    ${treeFilepath}`);

// const hashTable = buildLookupTable(results.tree);
fs.writeFileSync(indexFilepath, JSON.stringify(vaultIndex, null, 2));
console.log(`[ info ]: vault files index data has been saved as:    ${indexFilepath}`);