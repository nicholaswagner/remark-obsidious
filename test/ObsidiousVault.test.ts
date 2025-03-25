import { describe, it, expect } from "vitest";
import { processMarkdown } from "./shared";
import { DefaultRemarkObsidiousOptions as defaults } from "../src/index";
import { JSDOM } from "jsdom";
import RemarkObsidious from '../src/RemarkObsidious';
import { ObsidiousVault, ObsidiousVaultItem, slugify, slugifyFilepath } from '../src/index';
import generatedTestVaultIndex from '../testVault/obsidious-index.json';

describe("Obsidious Vault feature", () => {


    const firstVaultItemID: string = Object.keys(generatedTestVaultIndex.files)[0];
    const vaultItem: ObsidiousVaultItem = (generatedTestVaultIndex.files as Record<string, ObsidiousVaultItem>)[firstVaultItemID];


    it("should return a vault item for a valid ID", async () => {
        const vault = ObsidiousVault.initialize(generatedTestVaultIndex);
        const result = ObsidiousVault.getFileForId(`${firstVaultItemID}`);
        expect(result).not.toBeNull();
    });

    it("should be able get a file using a vault item label slug ", async () => {
        const vault = ObsidiousVault.initialize(generatedTestVaultIndex);
        const item = ObsidiousVault.getFileForLabelSlug(`${slugify(vaultItem.label)}`);
        expect(item).not.toBeNull();
    });

    it("should be able get a file using a webpath slug ", async () => {
        const vault = ObsidiousVault.initialize(generatedTestVaultIndex);
        const webPath = slugifyFilepath(vaultItem.filepath, vaultItem.extension);
        const item = ObsidiousVault.getFileForWebPathSlug(webPath);
        expect(item).not.toBeNull();
    });

    it("should contain images", async () => {
        const vault = ObsidiousVault.initialize(generatedTestVaultIndex);
        const images = ObsidiousVault.getAllImageFiles();
        expect(images.length).toBeGreaterThan(0);
    });



});