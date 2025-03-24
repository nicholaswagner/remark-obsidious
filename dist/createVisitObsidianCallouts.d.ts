import { Visitor } from 'unist-util-visit';
import type { Blockquote } from 'mdast';
import type { RemarkObsidiousOptions } from './RemarkObsidious';
type ExtendedBlockquote = Blockquote & {
    data?: Blockquote["data"] & {
        hProperties?: Record<string, any>;
    };
};
declare const createVisitObsidianCallouts: ({ classNames }: RemarkObsidiousOptions) => Visitor<ExtendedBlockquote>;
export default createVisitObsidianCallouts;
//# sourceMappingURL=createVisitObsidianCallouts.d.ts.map