export declare const ObsidiousVaultImageFiletypes: string[];
export type ObsidiousVaultItem = {
    extension?: string;
    filepath: string;
    fileType: string;
    id: string;
    label: string;
    mtimeMs?: number;
};
export type ObsidiousFileTreeNode = {
    children?: ObsidiousFileTreeNode[];
    id: string;
    label: string;
};
export type ObsidiousVaultData = {
    files: Record<string, ObsidiousVaultItem>;
    fileTree: ObsidiousFileTreeNode[];
    idsByExtension: Record<string, string[]>;
    idsByLabelSlug: Record<string, string>;
    idsByWebPath: Record<string, string>;
    imageIds: string[];
    stats: Record<string, any>;
};
export type ObsidiousVaultInterface = ObsidiousVaultData & {
    initialize: (data: ObsidiousVaultData) => ObsidiousVaultData;
    getAllImageFiles: () => ObsidiousVaultItem[];
    getFileForId: (id: string) => ObsidiousVaultItem | null;
    getFileForLabelSlug: (labelSlug: string) => ObsidiousVaultItem | null;
    getFileForWebPathSlug: (webPath: string) => ObsidiousVaultItem | null;
    getFilesByExtension: (extension: string) => ObsidiousVaultItem[];
    getFileTree: () => ObsidiousFileTreeNode[];
};
declare const ObsidiousVault: ObsidiousVaultInterface;
export { ObsidiousVault };
//# sourceMappingURL=ObsidiousVault.d.ts.map