
# 🚨 Not ready for use 🚨  
Let me dogfood this beast for a bit before you try to use it in anything you care about.  
I anticipate that I'll be making heavy changes as I get a feel for what works and what doesn't in the near future

---

### project goals
1. provide a remark plugin which will transform MDASTs that have Obsidian flavored features into a structured format.
2. provide a script which will walk an Obsidian vault and index it
3. provide a vault interface which exposes the following:
    - a filetree representation of the vault items
    - a lookup table organized by id for the vault items
    - some utility methods for working with the vault items

---

### Tasks

##### `remark-obsidious` plugin features:
- [x] `==hilight text==`
- [x] `[[internal links]]` with roll-over previews
- [x] `[[internal link | with alias]]`
- [x] `[[internal link#heading-anchor]]`
- [x] `[[internal link#heading| alias]]`
- [x] `![[embed images]]`
- [x] `![[embedded markdown]]`
- [x] `![[embedded markdown#heading]]`
- [x] `[!callout] Title`
    - with `[!nested_callouts] Nested Callouts`

---

##### `obsidious` vault indexing script
- [x] should be able to set an `in` path
- [x] should be able to set an `out` path
- [x] should be able to override the default index name
- [x] should be able to use a `.gitignore` file ask a mask
- [x] should know what `image files` are supported by the vault
    - _(avif,bmp,gif,jpeg,jpg,png,svg,webp) per https://help.obsidian.md/file-formats_
- [x] should have a `version` which matches the npm package semantic version
- [ ] should probably run under `node LTS` - (I'm currently on v23 😜)

---

##### `ObsidiousVault` Interface
- [x] `VaultItems` should have the following meta:
    - `filepath`: (relative path from `--in` to file)
    - `fileType`: `file` or `folder` 
    - `id`: a unique ID sha hash based on the filepath
    - `label`: the file's name recorded in the "obsidian" fashion
        - markdown file names are `filename` no extension
        - all other files are `filename.extension`
    - `mtimeMs`: last time the file was modified
- [x] `VaultFileTree` nodes should have
    - `children` array of child nodes
    - `id` vault item hash
    - `label`  the vault item label
- [x] `VaultInterface` should have
    - `files` a record of vault items organized by `id`
    - `fileTree` the generated `filetree`
    - `idsByExtension` a lookup table of vault item ids by extension type
    - `idsByLabelSlug` lookup table of vault item ids by sluggified vault labels
    - `idsByWebPath` lookup table of vault item ids by "webPath"s
    - `imageIds` a list of all the ids where the extension was a recognized obsidian image type
    - `stats` some stats about the vault

---
- [ ] Add Test coverage <-- in progress


###### Feature creep / future ideas
- [ ] [include `semantic-release`](https://www.npmjs.com/package/semantic-release) so i don't have deal with it 
- [ ] add github deployment strat 
- [ ] add support for `symlinks`
- [ ] total vault filesize
- [ ] consider the value of adding filesize for vaultItems vs increased index size
- [ ] MDX support
- [ ] consider some ~~excuses~~ ideas for [remark redirective](https://github.com/remarkjs/remark-directive) usage



---

### Coverage Report

```sh
 npx vitest run --coverage

 RUN  v3.0.9 /Users/bricksandwich/Repos/remark-obsidious
      Coverage enabled with v8

 ✓ test/ObsidiousVault.test.ts (4 tests) 1ms
 ✓ test/hilights.test.ts (3 tests) 7ms
 ✓ test/embeds.test.ts (4 tests) 26ms
 ✓ test/callouts.test.ts (5 tests) 31ms

 Test Files  4 passed (4)
      Tests  16 passed (16)
   Start at  20:42:16
   Duration  566ms (transform 48ms, setup 0ms, collect 239ms, tests 65ms, environment 695ms, prepare 138ms)

 % Coverage report from v8
---------------------------------|---------|----------|---------|---------|-----------------------------------
File                             | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                 
---------------------------------|---------|----------|---------|---------|-----------------------------------
All files                        |      38 |    71.01 |   78.94 |      38 |                                   
 bin                             |       0 |      100 |     100 |       0 |                                   
  obsidious.ts                   |       0 |      100 |     100 |       0 | 3-204                             
 scripts                         |       0 |      100 |     100 |       0 |                                   
  obsidious.ts                   |       0 |      100 |     100 |       0 | 3-204                             
  sync-npm-package-version.ts    |       0 |      100 |     100 |       0 | 3-17                              
 src                             |   81.13 |    69.23 |   73.33 |   81.13 |                                   
  ObsidiousUtils.ts              |   25.58 |      100 |   66.66 |   25.58 | 57-101                            
  ObsidiousVault.ts              |    90.9 |    61.53 |   71.42 |    90.9 | 55-57                             
  RemarkObsidious.ts             |     100 |      100 |      50 |     100 |                                   
  createVisitObsidianCallouts.ts |     100 |    71.42 |     100 |     100 | 21,24,27,40                       
  createVisitObsidianEmbeds.ts   |   83.33 |    65.21 |     100 |   83.33 | 27-28,31-34,44-49,107-108,113-114 
  createVisitObsidianHilights.ts |   92.85 |    66.66 |     100 |   92.85 | 25-26                             
  index.ts                       |     100 |      100 |     100 |     100 |                                   
 testVault/hidden_folder         |       0 |        0 |       0 |       0 |                                   
  hidden_file.ts                 |       0 |        0 |       0 |       0 |                                   
---------------------------------|---------|----------|---------|---------|-----------------------------------

```