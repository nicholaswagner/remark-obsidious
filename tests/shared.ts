import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import {
    ObsidiousOptions,
    remarkObsidious,
    DefaultRemarkObsidiousOptions as defaults,
    ObsidiousVaultData,
    ObsidiousVaultItem,
    ObsidiousFileTreeNode,
    slugifyFilepath,
    slugify
} from "../src/index";


const processMarkdown = async (markdown: string, options: ObsidiousOptions = {}) => {

    const processor = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkObsidious, options)
        .use(remarkRehype)
        .use(rehypeStringify);

    return String(await processor.process(markdown));

};


export const mockVaultItem: ObsidiousVaultItem = {
    extension: 'md',
    id: 'mockId',
    label: 'filename',
    filepath: 'vault/filename.md',
    fileType: 'file',
    mtimeMs: 0,
}

export const mockImageVaultItem: ObsidiousVaultItem = {
    extension: 'png',
    id: 'mockPngId',
    label: 'imageFilename.png',
    filepath: 'vault/imageFilename.png',
    fileType: 'file',
    mtimeMs: 0,
}

const mockFileTree: ObsidiousFileTreeNode[] = [
    { id: mockVaultItem.id, label: mockVaultItem.label },
    { id: mockImageVaultItem.id, label: mockImageVaultItem.label }
];

export const mockVaultData: ObsidiousVaultData = {
    files: {
        [mockVaultItem.id]: mockVaultItem,
        [mockImageVaultItem.id]: mockImageVaultItem,
    },
    fileTree: mockFileTree,
    idsByExtension: {
        md: [mockVaultItem.id],
        png: [mockImageVaultItem.id]
    },
    idsByLabelSlug: {
        [slugify(mockVaultItem.label)]: mockVaultItem.id, // in this case this is a valid label slug
        [slugify(mockImageVaultItem.label)]: mockImageVaultItem.id, // in this case this is a valid label slug
    },
    idsByWebPath: {
        [slugifyFilepath(mockVaultItem.filepath, mockVaultItem.extension)]: mockVaultItem.id,
        [slugifyFilepath(mockImageVaultItem.filepath, mockImageVaultItem.extension)]: mockImageVaultItem.id,
    },
    imageIds: [mockImageVaultItem.id],
    stats: {},

}

export { processMarkdown };