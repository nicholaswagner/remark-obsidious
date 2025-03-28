#!/usr/bin/env -S npx tsx

import { readFile, writeFile } from 'node:fs/promises';

const NPM_PACKAGE_VERSION = '0.9.8';

const getMarkerRegex = (marker: string) =>
    new RegExp(`<!--\\s*<${marker}>\\s*-->([\\s\\S]*?)<!--\\s*<${marker}\\s*/?>\\s*-->`, 'g');

const replaceComment = (data: string, marker: string, value: string): string => {
    const regex = getMarkerRegex(marker);
    if (!regex.test(data)) {
        console.warn(`Warning: Marker <${marker}> not found`);
        return data;
    } else {
        return data.replace(regex, `<!-- <${marker}> -->${value}<!-- <${marker}/> -->`);
    }
}

const filepath = './readme.md';
readFile(filepath, 'utf-8')
    .then((data) => {
        let output = replaceComment(data, 'version', NPM_PACKAGE_VERSION);
        return writeFile(filepath, output);
    })
    .catch((error) => {
        console.error('Error:', error);
    });