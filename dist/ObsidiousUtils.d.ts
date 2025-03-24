/**
 * Slugify a string by converting it to lowercase, removing diacritics, and replacing non-alphanumeric characters with underscores.
 * This implementation retains the "/" character so that I can create a slugged_folder looking structure that is similar to the original file structure.
 */
export declare const slugify: (str: string) => string;
export declare const slugifyFilepath: (filepath: string, extension?: string) => string;
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
export declare function hash(str: string): string;
//# sourceMappingURL=ObsidiousUtils.d.ts.map