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

    it('should transform [[wiki links]]', async () => {
        const header = 'some_header_ref';
        const input = `[[${mockVaultItem.label}#${header}]]`;
        const output = await processMarkdown(input, options);
        const dom = new JSDOM(output);
        const document = dom.window.document;
        const embed: HTMLAnchorElement | null = document.querySelector(`.${defaults.classNames.linkClassName}`);
        expect(embed).not.toBeNull();
        expect(embed?.href).toBe(`${mockVaultItem.filepath}#${slugify(header)}`);
        expect(embed?.getAttribute('data-ext')).toBe(mockVaultItem.extension);
        expect(embed?.getAttribute('data-hash-params')).toBe(slugify(header));
    });

    it('should support aliases for links', async () => {
        const header = 'some_header_ref';
        const alias = 'An alternate link title';
        const input = `[[${mockVaultItem.label}#${header} | ${alias}]]`;
        const output = await processMarkdown(input, options);
        const dom = new JSDOM(output);
        const document = dom.window.document;
        const embed: HTMLAnchorElement | null = document.querySelector(`.${defaults.classNames.linkClassName}`);
        expect(embed).not.toBeNull();
        expect(embed?.textContent).toBe(alias);
        expect(embed?.href).toBe(`${mockVaultItem.filepath}#${slugify(header)}`);
        expect(embed?.getAttribute('data-ext')).toBe(mockVaultItem.extension);
        expect(embed?.getAttribute('data-hash-params')).toBe(slugify(header));
    });

});