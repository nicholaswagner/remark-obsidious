// @vitest-environment jsdom

import { describe, it, expect } from "vitest";
import { processMarkdown } from "./shared";
import { DefaultRemarkObsidiousOptions as defaults } from "../src/index";
import { JSDOM } from "jsdom";

/**
 * The following is an example of a basic callout once transformed:
 * 
 * <blockquote data-callout="callout" data-initial-folded="false" data-title="This is a callout" class="callout">
 *  <p class="callout-title" data-callout="callout" data-title="This is a callout">This is a callout</p>
 * </blockquote>
 */

describe("Callouts feature", () => {
    it("should transform basic callouts", async () => {
        const input = `> [!callout] This is a callout`;
        const output = await processMarkdown(input);

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

    it("should support custom callout names", async () => {
        const input = `> [!bug] Because of course i'll need this callout...`;
        const output = await processMarkdown(input);

        const dom = new JSDOM(output);
        const document = dom.window.document;
        const callout = document.querySelector('blockquote[data-callout]');

        expect(callout).not.toBeNull();
        expect(callout?.getAttribute('data-callout')).toBe('bug');
        expect(callout?.getAttribute('data-initial-folded')).toBe('false'); // Default is false
        expect(callout?.getAttribute('data-title')).toBe('Because of course i\'ll need this callout...');
        expect(callout?.classList.contains(defaults.classNames.calloutClassName)).toBe(true);

        const title = callout?.querySelector('.callout-title');
        expect(title).not.toBeNull()
        expect(title?.textContent).toBe('Because of course i\'ll need this callout...');
    });

    it("should support initial folded state", async () => {
        const input = `> [!folded]- This should be folded by default`;
        const output = await processMarkdown(input);

        const dom = new JSDOM(output);
        const document = dom.window.document;
        const callout = document.querySelector('blockquote[data-callout]');

        expect(callout).not.toBeNull(); // Ensure the element exists
        expect(callout?.getAttribute('data-initial-folded')).toBe('true');
    });

    it("should support default folding state", async () => {
        const input = `> [!expanded]+ This should be initially expanded`;
        const output = await processMarkdown(input);

        const dom = new JSDOM(output);
        const document = dom.window.document;
        const callout = document.querySelector('blockquote[data-callout]');

        expect(callout).not.toBeNull(); // Ensure the element exists
        expect(callout?.getAttribute('data-initial-folded')).toBe('false');
    });

});