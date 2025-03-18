import { Transformer } from 'unified';
import { visit } from 'unist-util-visit';
import { Plugin } from "unified";
import { Root } from 'mdast';


import createVisitObsidianEmbeds from './createVisitObsidianEmbeds';
import createVisitObsidianCallouts from './createVisitObsidianCallouts';
import createVisitObsidianHilights from './createVisitObsidianHilights';
import { slugify } from './utils/slugify';
import Vault from './Vault';

import type { VaultItem } from './types/VaultItem';
import type { PluginOptions } from './types/PluginOptions';
import hash from './utils/hash';

export type ObsidiousOptions = Partial<PluginOptions>;
export { slugify } from './utils/slugify';
export { Vault };
export { hash };


const defaultConfig: PluginOptions = {
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
    getFileMetaForLabel: (_label: string): VaultItem | null => null,
};


const remarkObsidious: Plugin<[ObsidiousOptions], Root> = (options?: ObsidiousOptions): Transformer<Root, Root> => {
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


export default remarkObsidious;