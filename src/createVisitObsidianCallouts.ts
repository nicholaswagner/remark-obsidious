import { Visitor } from 'unist-util-visit';
import type { Blockquote, Paragraph, Text } from 'mdast';
import { RemarkObsidiousOptions } from './types/RemarkObsidious';

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

        const firstTextNode = firstParagraph.children.find((child) => child.type === 'text') as Text | undefined;
        if (!firstTextNode || typeof firstTextNode.value !== 'string' || firstTextNode.value.trim() === '') return;

        const match = calloutRegex.exec(firstTextNode.value);
        if (!match) return;

        const calloutType = match[1].toLowerCase(); // e.g. 'note', 'warning', 'info', etc.
        const foldableModifier = match[2] || ''; // - or + or empty
        const isFoldable = foldableModifier !== ''; // true if - or +
        const initialFolded = foldableModifier === '-'; // true if -


        firstTextNode.value = firstTextNode.value.replace(calloutRegex, '').trim(); // strip out the [! callout] part

        const titleText = firstTextNode.value || calloutType;

        blockquoteNode.data ??= {};
        blockquoteNode.data.hProperties = {
            ...blockquoteNode.data.hProperties,
            'data-callout': calloutType,
            'data-initial-folded': String(initialFolded),
            'data-title': titleText,
            className: [calloutClassName, isFoldable ? calloutIsFoldableClassName : '']
        };

        firstParagraph.data ??= {};
        if (!firstParagraph.data.hProperties) firstParagraph.data.hProperties = {};
        firstParagraph.data.hProperties = {
            ...firstParagraph.data.hProperties,
            className: [calloutTitleClassName],
            'data-callout': calloutType,
            'data-title': titleText
        };
    };
};


export default createVisitObsidianCallouts;