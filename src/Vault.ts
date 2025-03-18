import { VaultItem } from './types/VaultItem';

export type VaultFiles = {
    filesByID: Record<string, VaultItem>;
    fileIDForWebPathSlug: Record<string, string>;
    fileIDForLabelSlug: Record<string, string>;
    allImageFileIDs: string[];
};

let vaultData: VaultFiles | null = null;

const initialize = (data: VaultFiles): VaultFiles => {
    if (vaultData) return vaultData;
    vaultData = data;
    return vaultData;
};

const getFileForId = (id: string) => vaultData ? vaultData.filesByID[id] || null : null;
const getFileForWebPathSlug = (webPath: string) => vaultData ? getFileForId(vaultData.fileIDForWebPathSlug[webPath]) : null;
const getFileForLabelSlug = (labelSlug: string) => vaultData ? getFileForId(vaultData.fileIDForLabelSlug[labelSlug]) : null;
const getAllImageFiles = () => vaultData ? vaultData.allImageFileIDs.map(getFileForId).filter(item => item !== null) : [];
const getFilesByExtension = (extension: string) => {
    return vaultData ? Object.values(vaultData.filesByID).filter(
        (item) => item.fileType !== 'folder' && item.extension === extension
    ) : [];
};

const Vault = {
    initialize,
    getAllImageFiles,
    getFileForId,
    getFileForLabelSlug,
    getFileForWebPathSlug,
    getFilesByExtension,
};

export default Vault;