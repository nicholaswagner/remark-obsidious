#!/usr/bin/env -S npx tsx

import yargs from 'yargs';
import fs, { Dirent, readFileSync } from 'fs';
import path from 'path';
import hash from '../src/utils/hash';
import { slugify } from '../src/utils/slugify';
import ignore from 'ignore';

import type {
    ObsidiousVaultItem,
    ObsidiousVaultData,
    ObsidiousFileTreeNode,
} from '../src/types/Obsidious';


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

// We dont want to try to capture any .dotfiles or try to process any files that are in the gitignore
const gitignorePath = argv.ignore || path.join(argv.in, '.gitignore');
const gitignoreExists = fs.existsSync(gitignorePath)

let ig: ignore.Ignore | undefined;
if (gitignoreExists) {
    const gitignoreData = readFileSync(gitignorePath, 'utf8').toString();
    ig = ignore().add(gitignoreData);
    console.log('[info]: In addition to ignoring .dotfiles, the following .gitignore rules will be applied:');
    console.log(gitignoreData.split('\n').filter((line) => line && !line.startsWith('#')));
}
else {
    console.log('[info]: No file mask rules detected, all files (except .dotfiles) will be indexed.');
}

const treeFilepath = path.join(argv.out, argv.treeName || 'obsidious-tree.json');
const indexFilepath = path.join(argv.out, argv.indexName || 'obsidious-index.json');

const filterIgnored = (files: Dirent[], basePath: string): Dirent[] => {
    return files.filter((file) => {
        const filePath = path.join(basePath, file.name);
        if (file.name.startsWith('.')) return false; // no hidden files
        if (ig && ig.ignores(filePath.replace(argv.in, ''))) return false; // no ignored files
        return true;
    });
};

async function getTargetDirents(targetDir: string, basePath: string = ''): Promise<Dirent[]> {
    const ents = await fs.promises.readdir(targetDir, { withFileTypes: true });
    const filtered = filterIgnored(ents, path.join(basePath, targetDir));
    let result: Dirent[] = [];
    for (const ent of filtered) {
        const currentPath = path.join(basePath, targetDir, ent.name);
        result.push(ent);
        if (ent.isDirectory()) {
            const subDirents = await getTargetDirents(path.join(targetDir, ent.name), currentPath);
            result.push(...subDirents);
        }
    }
    return result;
}

const getFileExtension = (filePath: string): string => path.extname(filePath).slice(1);

const indexVault = async (dirents: Dirent[]) => {
    const obsidiousVault: ObsidiousVaultData = {
        files: {},
        fileTree: [],
        idsByExtension: {},
        idsByLabelSlug: {},
        idsByWebPath: {},
        imageIds: [],
        stats: {},
    }
    const Tree: ObsidiousFileTreeNode = { id: hash('root'), label: '', children: [] };

    for (const ent of dirents) {
        const { name: filename, parentPath } = ent;
        const dirPath = path.relative(argv.in, parentPath);
        const filepath = dirPath ? `${dirPath}/${filename}` : filename;
        const isFile = ent.isFile();
        const isDirectory = ent.isDirectory();
        const id = hash(filepath);

        let currentTree = Tree;
        let treeNode: ObsidiousFileTreeNode;
        let vaultItem: ObsidiousVaultItem;

        let stats;
        try { stats = await fs.promises.stat(path.join(parentPath, filename)); }
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
                    ...(stats?.mtimeMs ? { mtimeMs: stats.mtimeMs } : {}),
                    filepath,
                    fileType: isFile ? 'file' : 'folder',
                    id,
                    label,
                    labelSlug: slugify(label),
                    webPath,
                };
                obsidiousVault.files[id] = vaultItem;
                obsidiousVault.idsByWebPath[vaultItem.webPath] = id;
                obsidiousVault.idsByLabelSlug[vaultItem.labelSlug] = id;

                if (extension) {
                    (obsidiousVault.idsByExtension[extension] = obsidiousVault.idsByExtension[extension] || []).push(id);
                    obsidianImageTypes.includes(extension) && obsidiousVault.imageIds.push(id);
                }

                treeNode = isDirectory ? { id, label, children: [] } : { id, label };
                currentTree.children?.push(treeNode);
                if (isDirectory) currentTree = treeNode;

            } else {
                isDirectory && !existingChild.children && (existingChild.children = []);
                currentTree = existingChild;
            }
        });
    }

    obsidiousVault.fileTree = Tree.children || [];
    obsidiousVault.stats = {
        totalFiles: Object.keys(obsidiousVault.files).length,
        totalDirectories: Tree.children?.length || 0,
        totalImages: obsidiousVault.imageIds.length,
        fileTypesSummary: Object.entries(obsidiousVault.idsByExtension).map(([ext, ids]) => ({ ext, count: ids.length })),

    };

    return { tree: Tree.children, obsidiousVault };
};


try {
    const dirents = await getTargetDirents(argv.in).catch((err) => {
        console.error('\n[ Error ] encountered while attempting to map vault files:  ', err, '\n');
        process.exit(1);
    });

    const { tree, obsidiousVault } = await indexVault(dirents);

    fs.writeFileSync(treeFilepath, JSON.stringify(tree, null, 2));
    console.log(`[ info ]: vault files tree data has been saved as:    ${treeFilepath}`);

    fs.writeFileSync(indexFilepath, JSON.stringify(obsidiousVault, null, 2));
    console.log(`[ info ]: vault files index data has been saved as:    ${indexFilepath}`);

} catch (err) {
    console.error('[error]: Encountered an error while attempting to map vault files:', err);
    process.exit(1);
}