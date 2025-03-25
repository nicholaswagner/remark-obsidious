
// These are pulled from https://help.obsidian.md/file-formats
export const ObsidiousVaultImageFiletypes = ['avif', 'bmp', 'gif', 'jpeg', 'jpg', 'png', 'svg', 'webp'];


export type ObsidiousVaultItem = {
    extension?: string; // Always present for files (e.g., 'jpg', 'pdf' etc)
    filepath: string;
    fileType: string; // it will be 'folder' | 'file'; (i'm not gonna pull in schema validation just for this one line)
    id: string;
    label: string;
    mtimeMs?: number; // last modified time in milliseconds
};

export type ObsidiousFileTreeNode = {
    children?: ObsidiousFileTreeNode[];
    id: string;
    label: string;
}

export type ObsidiousVaultData = {
    files: Record<string, ObsidiousVaultItem>;
    fileTree: ObsidiousFileTreeNode[];
    idsByExtension: Record<string, string[]>;
    idsByLabelSlug: Record<string, string>;
    idsByWebPath: Record<string, string>;
    imageIds: string[];
    stats: Record<string, any>;
}

export type ObsidiousVaultInterface = ObsidiousVaultData & {
    initialize: (data: ObsidiousVaultData) => ObsidiousVaultData;
    getAllImageFiles: () => ObsidiousVaultItem[];
    getFileForId: (id: string) => ObsidiousVaultItem | null;
    getFileForLabelSlug: (labelSlug: string) => ObsidiousVaultItem | null;
    getFileForWebPathSlug: (webPath: string) => ObsidiousVaultItem | null;
    getFilesByExtension: (extension: string) => ObsidiousVaultItem[];
    getFileTree: () => ObsidiousFileTreeNode[];
}

let vaultData: ObsidiousVaultData | null = null;

const initialize = (data: ObsidiousVaultData): ObsidiousVaultInterface => {
    if (vaultData) return ObsidiousVault;
    vaultData = data;
    return ObsidiousVault;
};

const getFileForId = (id: string) => vaultData ? vaultData.files[id] || null : null;
const getFileForWebPathSlug = (webPath: string) => vaultData ? getFileForId(vaultData.idsByWebPath[webPath]) : null;
const getFileForLabelSlug = (labelSlug: string) => vaultData ? getFileForId(vaultData.idsByLabelSlug[labelSlug]) : null;
const getAllImageFiles = () => vaultData ? vaultData.imageIds.map(getFileForId).filter(item => item !== null) : [];
const getFileTree = () => vaultData ? vaultData.fileTree : [];
const getFilesByExtension = (extension: string): ObsidiousVaultItem[] => {
    const ids = vaultData ? (vaultData.idsByExtension[extension] || []) : [];
    return ids.map(getFileForId).filter(item => item !== null);
}

const ObsidiousVault: ObsidiousVaultInterface = {
    files: {},
    fileTree: [],
    idsByExtension: {},
    idsByLabelSlug: {},
    idsByWebPath: {},
    imageIds: [],
    stats: {},
    initialize,
    getAllImageFiles,
    getFileForId,
    getFileForLabelSlug,
    getFileForWebPathSlug,
    getFilesByExtension,
    getFileTree,
    ...(vaultData || {}),
};

export { ObsidiousVault };