// @vitest-environment jsdom

import { describe, it, expect } from "vitest";
import { processMarkdown } from "./shared";
import { DefaultRemarkObsidiousOptions as defaults, ObsidiousOptions } from "../src/index";
import { JSDOM } from "jsdom";

/**
 * The following is an example of a basic embed once transformed:
 * 
*/

describe("![[local_embed]] feature", () => {
    const options: ObsidiousOptions = {
        getVaultItemByLabelSlug: (labelSlug: string) => null
    }
    it("should show error when no file found", async () => {
        const input = `> ![[filename]]`;
        const output = await processMarkdown(input);
        console.log('\n\n', JSON.stringify(output, undefined, 3) + '\n\n');

        const dom = new JSDOM(output);
        const document = dom.window.document;
        const callout = document.querySelector('blockquote[data-callout]');

        // Assert that the callout has the correct attributes and class name
        expect(callout).not.toBeNull(); // Ensure the element exists
        expect(callout?.getAttribute('data-callout')).toBe('callout');
        expect(callout?.getAttribute('data-initial-folded')).toBe('false');
        expect(callout?.getAttribute('data-title')).toBe('This is a callout');
        expect(callout?.classList.contains(defaults.classNames.calloutClassName)).toBe(true);

        const title = callout?.querySelector('.callout-title');
        expect(title?.textContent).toBe('This is a callout');
    });



});