export type ObsidiousVaultItem = {
    children?: ObsidiousVaultItem[];
    extension?: string; // Always present for files (e.g., 'jpg', 'pdf')
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