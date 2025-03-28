import { Visitor } from 'unist-util-visit';
import type { Blockquote, Paragraph, Text, InlineCode, Strong, Emphasis, Image, ImageReference, Html, PhrasingContent, Break } from 'mdast';
import type { RemarkObsidiousOptions } from './RemarkObsidious';

type ExtendedBlockquote = Blockquote & {
    data?: Blockquote["data"] & {
        hProperties?: Record<string, any>;
    };
};

type ExtendedParagraph = Paragraph & {
    data?: {
        hProperties?: Record<string, any>;
    }
}

const calloutRegex = /^\[\!\s*([\w-]+)\s*\]([-+]?)/;

const createVisitObsidianCallouts = ({ classNames }: RemarkObsidiousOptions): Visitor<ExtendedBlockquote> => {
    const { calloutClassName, calloutIsFoldableClassName, calloutTitleClassName } = classNames;

    return (blockquoteNode) => {
        if (!Array.isArray(blockquoteNode.children) || blockquoteNode.children.length === 0) return;

        const firstParagraph = blockquoteNode.children.find((child) => child.type === 'paragraph') as ExtendedParagraph | undefined;
        if (!firstParagraph || firstParagraph.children.length === 0) return;

        const firstTextNode = firstParagraph.children[0] as PhrasingContent;
        if (!firstTextNode || !('value' in firstTextNode) || typeof firstTextNode.value !== 'string') return;

        const match = calloutRegex.exec(firstTextNode.value);
        if (!match) return;

        const calloutType = match[1].toLowerCase();
        const foldableModifier = match[2] || '';
        const isFoldable = foldableModifier !== '';
        const initialFolded = foldableModifier === '-';

        // Remove callout marker from the first text node
        firstTextNode.value = firstTextNode.value.replace(calloutRegex, '').trim();

        // Collect title text and remaining nodes
        let titleNodes: PhrasingContent[] = [];
        let remainingNodes: PhrasingContent[] = [];
        let foundNewline = false;

        for (const node of firstParagraph.children) {
            if (foundNewline) {
                remainingNodes.push(node);
            } else if (node.type === 'text' && node.value.includes('\n')) {
                // If we hit a newline inside a text node, split it
                const [before, after] = node.value.split(/\r?\n/, 2);
                if (before.trim()) titleNodes.push({ ...node, value: before.trim() });
                if (after.trim()) remainingNodes.push({ ...node, value: after.trim() });
                foundNewline = true;
            } else {
                titleNodes.push(node);
            }
        }

        // If there's no title text, use callout type
        if (titleNodes.length === 0) {
            titleNodes = [{ type: 'text', value: calloutType }];
        }

        // Assign extracted title back to first paragraph
        firstParagraph.children = titleNodes;

        // If there's remaining content, insert it as a new paragraph
        if (remainingNodes.length > 0) {
            blockquoteNode.children.splice(1, 0, {
                type: 'paragraph',
                children: remainingNodes,
            });
        }

        // Add custom properties for rendering
        blockquoteNode.data ??= {};
        blockquoteNode.data.hProperties = {
            ...blockquoteNode.data.hProperties,
            'data-callout': calloutType,
            'data-initial-folded': String(initialFolded),
            className: [calloutClassName, isFoldable ? calloutIsFoldableClassName : ''],
        };

        firstParagraph.data ??= {};
        firstParagraph.data.hProperties = {
            className: [calloutTitleClassName],
            'data-callout': calloutType,
        };
    };
};

export default createVisitObsidianCallouts;