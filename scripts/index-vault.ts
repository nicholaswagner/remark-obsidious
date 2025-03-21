#!/usr/bin/env -S npx tsx

import * as fs from 'fs'
import * as path from 'path';
import { Dirent, readFileSync } from 'fs';
import { hash, slugify } from '../src/ObsidiousUtils';
import ignore from 'ignore';
import yargs from 'yargs';

import type {
    ObsidiousVaultItem,
    ObsidiousVaultData,
    ObsidiousFileTreeNode
} from '../src/ObsidiousVault';

import { ObsidiousVaultImageFiletypes } from '../src/ObsidiousVault';

const argv = await yargs(process.argv.slice(2))
    .option('in', { type: 'string', default: process.cwd(), demandOption: false, describe: 'The directory where file indexing begins. This is usually your obsidian vault.' })
    .option('out', { type: 'string', default: process.cwd(), demandOption: false, describe: 'The directory where the index files will be written.' })
    .option('indexName', { type: 'string', default: 'obsidious-index.json', demandOption: false, describe: 'Use a custom name for the resulting obsidious-index.json' })
    .option('ignore', { type: 'string', describe: 'path to gitignore which will filter the vault' })
    .help()
    .alias('h', 'help')
    .argv;

const inDir = path.resolve(argv.in);
const outDir = path.resolve(argv.out);
const indexFilepath = path.join(outDir, argv.indexName);

const gitignorePath = argv.ignore || path.join(inDir, '.gitignore');
const gitignoreExists = fs.existsSync(gitignorePath)

const obsidiousVault: ObsidiousVaultData = {
    files: {},
    fileTree: [],
    idsByExtension: {},
    idsByLabelSlug: {},
    idsByWebPath: {},
    imageIds: [],
    stats: {},
};

// The children node of this Tree will become the root node of the output FileTree
const Tree: ObsidiousFileTreeNode = { id: hash('root'), label: '', children: [] };

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

const filterIgnored = (files: Dirent[], basePath: string): Dirent[] => {
    return files.filter((file) => {
        const filePath = path.join(basePath, file.name);
        if (file.name.startsWith('.')) return false; // no hidden files

        const relativePath = path.relative(inDir, filePath); // Ensure proper relative path
        if (ig && ig.ignores(relativePath)) return false; // no ignored files

        return true;
    });
};

async function getTargetDirents(targetDir: string, basePath: string = ''): Promise<Dirent[]> {
    console.log('[info]: scanning directory: ', targetDir);
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

    for (const ent of dirents) {
        const { name: filename, parentPath } = ent;
        const dirPath = path.relative(inDir, parentPath);
        const filepath = dirPath ? `${dirPath}/${filename}` : filename;
        const isFile = ent.isFile();
        const isDirectory = ent.isDirectory();
        const id = hash(filepath);

        let stats;
        try {
            stats = await fs.promises.stat(path.join(parentPath, filename));
        } catch (error) {
            console.error(`Error getting stats for file ${filepath}:`, error);
            stats = { mtimeMs: 0 }; // Default value to prevent undefined access
        }

        let currentTree = Tree;

        const segments = filepath.split('/');
        for (let i = 0; i < segments.length; i++) {
            const part = segments[i];
            // const isLastSegment = i === segments.length - 1;
            const existingChild = currentTree.children?.find((child) => child.label === part);

            if (!existingChild) {
                const extension = isFile ? getFileExtension(filename) : undefined;
                const label = isFile && extension === 'md' ? filename.replace(`.${extension}`, '') : filename;
                const webPath = slugify(isFile && extension === 'md' ? filepath.replace(`.${extension}`, '') : filepath);
                const children = isDirectory ? [] : undefined;

                const vaultItem: ObsidiousVaultItem = {
                    ...(isFile ? { extension } : {}),
                    ...(children ? { children } : {}),
                    ...(stats?.mtimeMs ? { mtimeMs: stats.mtimeMs } : {}),
                    filepath,
                    fileType: isFile ? 'file' : 'folder',
                    id,
                    label,
                };

                obsidiousVault.files[id] = vaultItem;
                obsidiousVault.idsByWebPath[webPath] = id;
                obsidiousVault.idsByLabelSlug[slugify(label)] = id;

                if (extension) {
                    (obsidiousVault.idsByExtension[extension] = obsidiousVault.idsByExtension[extension] || []).push(id);
                    if (ObsidiousVaultImageFiletypes.includes(extension)) {
                        obsidiousVault.imageIds.push(id);
                    }
                }

                const newNode: ObsidiousFileTreeNode = { id, label, ...(isDirectory && { children: [] }) };
                currentTree.children?.push(newNode);
                currentTree = isDirectory ? newNode : currentTree;
            } else {
                currentTree = existingChild;
            }
        }
    }

    obsidiousVault.fileTree = Tree.children || [];
    obsidiousVault.stats = {
        totalFiles: Object.keys(obsidiousVault.files).length,
        totalDirectories: Tree.children?.length || 0,
        totalImages: obsidiousVault.imageIds.length,
        fileTypesSummary: Object.entries(obsidiousVault.idsByExtension).map(([ext, ids]) => ({ ext, count: ids.length })),
    };

    return obsidiousVault;
};

try {
    const dirents = await getTargetDirents(inDir).catch((err) => {
        console.error('\n[ Error ] encountered while attempting to map vault files:  ', err, '\n');
        process.exit(1);
    });

    const obsidiousVault = await indexVault(dirents);

    fs.writeFileSync(indexFilepath, JSON.stringify(obsidiousVault, null, 2));
    console.log(`[ info ]: vault files index data has been saved as:    ${indexFilepath}`);

} catch (err) {
    console.error('[error]: Encountered an error while attempting to map vault files:', err);
    process.exit(1);
}