export type VaultItem = {
    children?: VaultItem[];
    extension?: string; // Always present for files (e.g., 'jpg', 'pdf')
    filepath: string;
    fileType: 'folder' | 'file' | 'symlink';
    id: string;
    label: string;
    labelSlug: string;
    webPath: string;
    mtimeMs?: number; // last modified time in milliseconds
};