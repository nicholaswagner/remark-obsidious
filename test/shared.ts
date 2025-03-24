import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { ObsidiousOptions, remarkObsidious, DefaultRemarkObsidiousOptions as defaults, ObsidiousVaultData, ObsidiousVaultItem, ObsidiousFileTreeNode } from "../src/index";


const processMarkdown = async (markdown: string, options: ObsidiousOptions = {}) => {

    const processor = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkObsidious, options)
        .use(remarkRehype)
        .use(rehypeStringify);

    return String(await processor.process(markdown));

};


const mockVaultItem: ObsidiousVaultItem = {
    extension: 'md',
    id: 'id',
    label: 'filename',
    filepath: 'vault/filename.md',
    fileType: 'file',
    mtimeMs: 0,
}

const mockFileTree: ObsidiousFileTreeNode[] = [
    {
        id: 'id',
        label: 'filename',
    }
];

const mockVaultDataEmpty: ObsidiousVaultData = {
    files: {},
    fileTree: [],
    idsByExtension: {},
    idsByLabelSlug: {},
    idsByWebPath: {},
    imageIds: [],
    stats: {},
}

const mockVaultData: ObsidiousVaultData = {
    files: {
        id: mockVaultItem,
    },
    fileTree: [],
    idsByExtension: {
        md: ['id'],
    },
    idsByLabelSlug: {
        filename: 'id',
    },
    idsByWebPath: {
        'vault/filename.md': 'id',
    },
    imageIds: [],
    stats: {},

}

export { processMarkdown };