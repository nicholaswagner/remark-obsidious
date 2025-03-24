import { describe, it, expect } from "vitest";
import { processMarkdown } from "./shared";
import { DefaultRemarkObsidiousOptions as defaults } from "../src/index";

describe("remark-obsidious - hilights feature", () => {
    it("should transform basic Obsidian hilights correctly", async () => {
        const input = `==This is a hilight==`;
        const output = await processMarkdown(input);
        expect(output).toContain(`<p><mark class="${defaults.classNames.hilightClassName}">This is a hilight</mark></p>`);
    });

    it("should transform basic Obsidian hilights correctly when given extra whitespace characters", async () => {
        const input = `==  This is a hilight  ==`;
        const output = await processMarkdown(input);
        expect(output).toContain(`<p><mark class="${defaults.classNames.hilightClassName}">  This is a hilight  </mark></p>`);
    });

    it("should not interpret a single == as the beginning of a hilight", async () => {
        const input = `Markdown == Awesome`;
        const output = await processMarkdown(input);
        expect(output).toSatisfy((output: string) => !output.includes("<mark>"));
    });
}); 