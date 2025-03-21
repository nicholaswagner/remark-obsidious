/**
 * Slugify a string by converting it to lowercase, removing diacritics, and replacing non-alphanumeric characters with underscores.
 * This implementation retains the "/" character so that I can create a slugged_folder looking structure that is similar to the original file structure.
 */
export const slugify = (str: string) =>
    str
        .toLowerCase()
        .normalize("NFD") // Convert accented chars to base form
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
        .replace(/[^a-z0-9\/]+/g, "-") // Replace non-alphanumeric (except `/`) with `-`
        .replace(/_+/g, "_") // Collapse multiple underscores into one
        .replace(/^_+|_+$/g, ""); // Trim leading/trailing `_`


export const slugifyFilepath = (filepath: string, extension?: string) =>
    extension === 'md' ? slugify(filepath.replace(/\.md$/, '')) : slugify(filepath);



/**
 * MIT License
 * Copyright (c) Emotion team and other contributors
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 * Murmur2 hash implementation copied from: 
 * https://github.com/emotion-js/emotion/blob/cce67ec6b2fc94261028b4f4778aae8c3d6c5fd6/packages/hash/src/index.ts#L5
 * 
 */

/* eslint-disable */
// @ts-nocheck

export function hash(str: string): string {
    // 'm' and 'r' are mixing constants generated offline.
    // They're not really 'magic', they just happen to work well.

    // const m = 0x5bd1e995;
    // const r = 24;

    // Initialize the hash
    var h = 0

    // Mix 4 bytes at a time into the hash
    var k,
        i = 0,
        len = str.length
    for (; len >= 4; ++i, len -= 4) {
        k =
            (str.charCodeAt(i) & 0xff) |
            ((str.charCodeAt(++i) & 0xff) << 8) |
            ((str.charCodeAt(++i) & 0xff) << 16) |
            ((str.charCodeAt(++i) & 0xff) << 24)

        k =
            /* Math.imul(k, m): */
            (k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0xe995) << 16)
        k ^= /* k >>> r: */ k >>> 24

        h =
            /* Math.imul(k, m): */
            ((k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0xe995) << 16)) ^
            /* Math.imul(h, m): */
            ((h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0xe995) << 16))
    }
    // Handle the last few bytes of the input array
    switch (len) {
        case 3:
            h ^= (str.charCodeAt(i + 2) & 0xff) << 16
        case 2:
            h ^= (str.charCodeAt(i + 1) & 0xff) << 8
        case 1:
            h ^= str.charCodeAt(i) & 0xff
            h =
                /* Math.imul(h, m): */
                (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0xe995) << 16)
    }
    // Do a few final mixes of the hash to ensure the last few
    // bytes are well-incorporated.
    h ^= h >>> 13
    h =
        /* Math.imul(h, m): */
        (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0xe995) << 16)

    return ((h ^ (h >>> 15)) >>> 0).toString(36)
}
