// @vitest-environment jsdom

import { describe, it, expect } from "vitest";
import { processMarkdown } from "./shared";
import { DefaultRemarkObsidiousOptions as defaults } from "../src/index";
import { JSDOM } from "jsdom";
import content from '../testVault/callouts/nested callouts.md?raw';

describe("Callouts feature", () => {
    it("should transform basic callouts", async () => {
        const input = `> [!callout] This is a callout`;
        const output = await processMarkdown(input);

        const dom = new JSDOM(output);
        const document = dom.window.document;
        const callout = document.querySelector('blockquote[data-callout]');
        expect(callout).not.toBeNull();
        expect(callout?.getAttribute('data-callout')).toBe('callout');
        expect(callout?.getAttribute('data-initial-folded')).toBe('false');
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
        expect(callout?.classList.contains(defaults.classNames.calloutClassName)).toBe(true);

        const title = callout?.querySelector('.callout-title');
        expect(title).not.toBeNull()
        expect(title?.textContent).toBe('Because of course i\'ll need this callout...');
    });

    it("should respect initial folded state -", async () => {
        const input = `> [!folded]- This should be folded by default`;
        const output = await processMarkdown(input);

        const dom = new JSDOM(output);
        const document = dom.window.document;
        const callout = document.querySelector('blockquote[data-callout]');

        expect(callout).not.toBeNull(); // Ensure the element exists
        expect(callout?.getAttribute('data-initial-folded')).toBe('true');
        expect(callout?.getAttribute('class')).toContain(defaults.classNames.calloutIsFoldableClassName);
    });

    it("should respect default folding state +", async () => {
        const input = `> [!expanded]+ This should be initially expanded`;
        const output = await processMarkdown(input);

        const dom = new JSDOM(output);
        const document = dom.window.document;
        const callout = document.querySelector('blockquote[data-callout]');

        expect(callout).not.toBeNull(); // Ensure the element exists
        expect(callout?.getAttribute('data-initial-folded')).toBe('false');
        expect(callout?.getAttribute('class')).toContain(defaults.classNames.calloutIsFoldableClassName);
    });

    it("should support nested callouts", async () => {
        const input = content;
        const output = await processMarkdown(input);

        const dom = new JSDOM(output);
        const document = dom.window.document;
        const callout = document.querySelector('blockquote[data-callout="info"]');
        const level2 = callout?.querySelector('blockquote[data-callout="success"]');
        const level3 = level2?.querySelector('blockquote[data-callout="gem"]');

        expect(callout).not.toBeNull();
        expect(level2).not.toBeNull();
        expect(level3).not.toBeNull();
    });

});