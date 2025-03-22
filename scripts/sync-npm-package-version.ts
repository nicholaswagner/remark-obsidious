#!/usr/bin/env -S npx tsx

import { readFile, writeFile } from 'node:fs/promises';
import packagejson from '../package-lock.json';

const version = packagejson.version;
const filepath = './scripts/obsidious.ts';

let content = await readFile(filepath, 'utf-8');
content = content.replace(
    /const\s+NPM_PACKAGE_VERSION\s*=\s*['"`][^'"`]+['"`]/,
    `const NPM_PACKAGE_VERSION = '${version}'`
);

await writeFile(filepath, content, 'utf-8');

console.log(`Updated version to ${version} in ${filepath}`);