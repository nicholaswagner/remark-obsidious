import { Visitor } from 'unist-util-visit';
import { Literal } from 'mdast';
import { RemarkObsidiousOptions } from './RemarkObsidious';
/**
 * Creates a visitor function that processes Obsidian links and embeds in markdown nodes.
 * When links are encountered,
 */
declare const createVisitObsidianEmbeds: ({ basePath, classNames, filePathPrefix, getFileMetaForLabel, slugify }: RemarkObsidiousOptions) => Visitor<Literal>;
export default createVisitObsidianEmbeds;
//# sourceMappingURL=createVisitObsidianEmbeds.d.ts.map