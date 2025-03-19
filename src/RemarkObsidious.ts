import { Transformer } from 'unified';
import { visit } from 'unist-util-visit';
import { Plugin } from "unified";
import { Root } from 'mdast';

import { slugify } from './utils';
import createVisitObsidianEmbeds from './createVisitObsidianEmbeds';
import createVisitObsidianCallouts from './createVisitObsidianCallouts';
import createVisitObsidianHilights from './createVisitObsidianHilights';

import type { ObsidiousVaultItem } from './types/Obsidious';
import type { RemarkObsidiousOptions } from './types/RemarkObsidious';

export type ObsidiousOptions = Partial<RemarkObsidiousOptions>;

const defaultConfig: RemarkObsidiousOptions = {
    basePath: '/',
    classNames: {
        calloutClassName: 'callout',
        calloutIsFoldableClassName: 'foldable',
        calloutTitleClassName: 'callout-title',
        errorClassName: 'obsidian-md-error',
        hilightClassName: 'obsidian-hilight',
        imageClassName: 'obsidian-img',
        linkClassName: 'obsidian-link',
        embeddedMdClassName: 'obsidian-md-embed ',
    },
    filePathPrefix: '/vault/',
    slugify,
    getFileMetaForLabel: (_label: string): ObsidiousVaultItem | null => null,
};

const RemarkObsidious: Plugin<[ObsidiousOptions], Root> = (options?: ObsidiousOptions): Transformer<Root, Root> => {
    const config = { ...defaultConfig, ...options };
    const visitObsidianEmbeds = createVisitObsidianEmbeds({ ...config });
    const visitObsidianCallouts = createVisitObsidianCallouts({ ...config });
    const visitObsidianHilights = createVisitObsidianHilights({ ...config });

    return (tree) => {
        visit(tree, 'blockquote', visitObsidianCallouts);
        visit(tree, 'text', visitObsidianHilights);
        visit(tree, 'text', visitObsidianEmbeds);
    };
}

export default RemarkObsidious;