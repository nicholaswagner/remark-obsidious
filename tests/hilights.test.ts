import { describe, it, expect } from "vitest";
import { processMarkdown } from "./shared";
import { DefaultRemarkObsidiousOptions as defaults } from "../src/index";

describe("remark-obsidious - hilights feature", () => {
    it("should transform basic Obsidian hilights correctly", async () => {
        const text = 'This is some hilighted text';
        const input = `==${text}==`;
        const output = await processMarkdown(input);
        expect(output).toContain(`<p><mark class="${defaults.classNames.hilightClassName}">${text}</mark></p>`);
    });

    it("should respect whitespace correctly while transforming hilights", async () => {
        const text = 'This is some hilighted text';
        const input = `==  ${text}  ==`;
        const output = await processMarkdown(input);
        expect(output).toContain(`<p><mark class="${defaults.classNames.hilightClassName}">  ${text}  </mark></p>`);
    });

    it("should not interpret a single == as the beginning of a hilight", async () => {
        const input = `Markdown == Awesome`;
        const output = await processMarkdown(input);
        expect(output).toSatisfy((output: string) => !output.includes("<mark>"));
    });

    it("should support hilights in callout titles", async () => {
        const text = 'This is some hilighted text';
        const input = `[\!info]==${text}==`;
        const output = await processMarkdown(input);
        expect(output).toContain(`<mark class="${defaults.classNames.hilightClassName}">${text}</mark>`);
    });
}); 