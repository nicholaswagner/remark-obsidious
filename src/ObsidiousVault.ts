import type { ObsidiousVaultInterface, ObsidiousVaultData, ObsidiousVaultItem } from './types/Obsidious';

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

export default ObsidiousVault;