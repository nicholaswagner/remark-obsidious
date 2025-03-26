#!/usr/bin/env -S npx tsx

import { readFile, writeFile } from 'node:fs/promises';
import packagejson from '../package-lock.json';

const version = packagejson.version;
const filepaths = [
    './scripts/obsidious.ts',
    './scripts/update-readme.ts',
];

for (const path of filepaths) {
    let content = await readFile(path, 'utf-8');
    content = content.replace(
        /const\s+NPM_PACKAGE_VERSION\s*=\s*['"`][^'"`]+['"`]/,
        `const NPM_PACKAGE_VERSION = '${version}'`
    );
    await writeFile(path, content, 'utf-8');
}
