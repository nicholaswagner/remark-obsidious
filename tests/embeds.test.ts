import { describe, it, expect } from "vitest";
import { processMarkdown } from "./shared";
import {
    DefaultRemarkObsidiousOptions as defaults,
    ObsidiousOptions,
    ObsidiousVaultData,
    ObsidiousVaultItem,
    slugify
} from "../src/index";
import { JSDOM } from "jsdom";
import { mockVaultData, mockVaultItem, mockImageVaultItem } from "./shared";

describe("![[local_embed]] feature", () => {

    const options: ObsidiousOptions = {
        getVaultItemByLabelSlug: (labelSlug: string) => mockVaultData.files[mockVaultData.idsByLabelSlug[labelSlug]] || null,
    }

    it('should transform .md embed', async () => {
        const input = ` > ![[${mockVaultItem.label}]]`;
        const output = await processMarkdown(input, options);
        const dom = new JSDOM(output);
        const document = dom.window.document;
        const embed = document.querySelector(`.${defaults.classNames.mdClassName}`);
        expect(embed?.getAttribute('data-file-id')).toBe(mockVaultItem.id);
        expect(embed?.getAttribute('data-hash-params')).toBe('');
        expect(embed?.getAttribute('data-meta')).toBeNull();
        expect(embed).not.toBeNull();
    });

    it('should transform image embed', async () => {
        const input = `![[${mockImageVaultItem.label}]]`;
        const output = await processMarkdown(input, options);
        const dom = new JSDOM(output);
        const document = dom.window.document;
        const embed = document.querySelector(`.${defaults.classNames.imageClassName}`);
        expect(embed).not.toBeNull();
        expect(embed?.getAttribute('data-ext')).toBe(mockImageVaultItem.extension);
        expect(embed?.getAttribute('data-label')).toBe(mockImageVaultItem.label);
        expect(embed?.getAttribute('alt')).toBe(mockImageVaultItem.label);
        expect(embed?.getAttribute('data-meta')).toBeNull();
    });

    it('image embeds should be assigned meta', async () => {
        const imageMeta = '200x200';
        const input = `![[${mockImageVaultItem.label} | ${imageMeta}]]`;
        const output = await processMarkdown(input, options);
        const dom = new JSDOM(output);
        const document = dom.window.document;
        const embed = document.querySelector(`.${defaults.classNames.imageClassName}`);
        expect(embed).not.toBeNull();
        expect(embed?.getAttribute('data-ext')).toBe(mockImageVaultItem.extension);
        expect(embed?.getAttribute('data-label')).toBe(mockImageVaultItem.label);
        expect(embed?.getAttribute('alt')).toBe(mockImageVaultItem.label);
        expect(embed?.getAttribute('data-meta')).toBe(imageMeta);
    });

});