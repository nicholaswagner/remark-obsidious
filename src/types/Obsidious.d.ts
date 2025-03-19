export type ObsidiousVaultItem = {
    children?: ObsidiousVaultItem[];
    extension?: string; // Always present for files (e.g., 'jpg', 'pdf')
    filepath: string;
    fileType: 'folder' | 'file';
    id: string;
    label: string;
    labelSlug: string;
    mtimeMs?: number; // last modified time in milliseconds
    webPath: string;
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