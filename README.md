
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


### Tasks
---

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
- [ ] should probably run under `node LTS`

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



###### Feature creep
- [ ] add support for `symlinks`
- [ ] total vault filesize
- [ ] consider adding filesize for vaultItems