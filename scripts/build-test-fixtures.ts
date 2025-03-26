#!/usr/bin/env -S npx tsx

import * as fs from 'fs'
import * as path from 'path';
import { Dirent, readFileSync } from 'fs';
import { hash, slugify } from '../src/ObsidiousUtils';
import ignore from 'ignore';
import yargs from 'yargs';

const NPM_PACKAGE_VERSION = '0.6.0';

import type {
    ObsidiousVaultItem,
    ObsidiousVaultData,
    ObsidiousFileTreeNode
} from '../src/ObsidiousVault';

import vaultData from '../testVault/test-index.json';
import { processMarkdown } from '../tests/shared';
import { ObsidiousOptions, ObsidiousVault } from '../src';

const vaultOptions: ObsidiousOptions = {
    basePath: '',
    filePathPrefix: '/',
    getVaultItemByLabelSlug: (label) => ObsidiousVault.getFileForLabelSlug(slugify(label))
}

ObsidiousVault.initialize(vaultData);

const pwd = process.cwd();
const vaultPath = path.resolve(pwd, './testVault');
const markdownItems = ObsidiousVault.getFilesByExtension('md');
for (const item of markdownItems) {
    const text = readFileSync(path.join(vaultPath, item.filepath), 'utf8');
    const html = await processMarkdown(text, vaultOptions);
    const htmlPath = path.join(vaultPath, item.filepath.replace('.md', '.html'));
    fs.writeFileSync(htmlPath, html);
}