import { ObsidiousOptions } from './RemarkObsidious';
import Obsidious from './Obsidious';
import RemarkObsidious from './RemarkObsidious';

export type { ObsidiousOptions }
export type { ObsidiousVaultInterface, ObsidiousFileTreeNode, ObsidiousVaultData, ObsidiousVaultItem } from './types/Obsidious';
export { Obsidious, RemarkObsidious, }
export { hash, slugify, slugifyFilepath } from './utils';