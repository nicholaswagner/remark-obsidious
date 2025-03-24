
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
- [ ] add support for `symlinks`
- [ ] total vault filesize
- [ ] consider the value of adding filesize for vaultItems vs increased index size
- [ ] MDX support
- [ ] consider some ~~excuses~~ ideas for [remark redirective](https://github.com/remarkjs/remark-directive) usage



---

### Coverage Report

```sh

> remark-obsidious@0.6.0 coverage
> vitest run --coverage


 RUN  v3.0.9 /Users/bricksandwich/Repos/remark-obsidious
      Coverage enabled with v8

 ✓ test/hilights.test.ts (3 tests) 7ms
 ✓ test/callouts.test.ts (5 tests | 4 skipped) 17ms
 ✓ test/embeds.test.ts (5 tests) 27ms

 Test Files  3 passed (3)
      Tests  9 passed | 4 skipped (13)
   Start at  17:19:25
   Duration  553ms (transform 41ms, setup 0ms, collect 259ms, tests 51ms, environment 495ms, prepare 96ms)

 % Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |   38.33 |    75.43 |      50 |   38.33 |                   
 bin               |       0 |      100 |     100 |       0 |                   
  obsidious.ts     |       0 |      100 |     100 |       0 | 3-204             
 scripts           |       0 |      100 |     100 |       0 |                   
  obsidious.ts     |       0 |      100 |     100 |       0 | 3-204             
  ...ge-version.ts |       0 |      100 |     100 |       0 | 3-17              
 src               |   81.85 |    74.07 |      40 |   81.85 |                   
  ...diousUtils.ts |   25.58 |      100 |   66.66 |   25.58 | 57-101            
  ...diousVault.ts |   78.78 |      100 |       0 |   78.78 | 45-48,56-58       
  ...kObsidious.ts |     100 |      100 |      50 |     100 |                   
  ...anCallouts.ts |     100 |    71.42 |     100 |     100 | 21,24,27,40       
  ...dianEmbeds.ts |   89.58 |       72 |     100 |   89.58 | ...07-108,113-114 
  ...anHilights.ts |   92.85 |    66.66 |     100 |   92.85 | 25-26             
  index.ts         |     100 |      100 |     100 |     100 |                   
-------------------|---------|----------|---------|---------|-------------------


```