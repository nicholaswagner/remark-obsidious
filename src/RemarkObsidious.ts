import { Transformer } from 'unified';
import { visit } from 'unist-util-visit';
import { Plugin } from "unified";
import { Root } from 'mdast';

import { slugify } from './ObsidiousUtils';
import createVisitObsidianEmbeds from './createVisitObsidianEmbeds';
import createVisitObsidianCallouts from './createVisitObsidianCallouts';
import createVisitObsidianHilights from './createVisitObsidianHilights';

import { ObsidiousVault, type ObsidiousVaultItem } from './ObsidiousVault'

export type RemarkObsidiousOptions = {
    basePath: string;
    classNames: {
        calloutClassName: string;
        calloutIsFoldableClassName: string;
        calloutTitleClassName: string;
        errorClassName: string;
        hilightClassName: string;
        imageClassName: string;
        linkClassName: string;
        mdClassName: string;
    };
    filePathPrefix: string;
    slugify: typeof slugify;
    getVaultItemByLabelSlug: (labelSlug: string) => ObsidiousVaultItem | null;
};


export type ObsidiousOptions = Partial<Omit<RemarkObsidiousOptions, 'classNames'> & {
    classNames?: Partial<RemarkObsidiousOptions['classNames']>;
}>;

export const DefaultRemarkObsidiousOptions: RemarkObsidiousOptions = {
    basePath: '',
    classNames: {
        calloutClassName: 'callout',
        calloutIsFoldableClassName: 'foldable',
        calloutTitleClassName: 'callout-title',
        errorClassName: 'obsidian-md-error',
        hilightClassName: 'obsidian-hilight',
        imageClassName: 'obsidian-img',
        linkClassName: 'obsidian-link',
        mdClassName: 'obsidian-md-embed ',
    },
    filePathPrefix: '',
    slugify,
    getVaultItemByLabelSlug: (labelSlug: string) => ObsidiousVault.getFileForLabelSlug(labelSlug),
};

const RemarkObsidious: Plugin<[ObsidiousOptions?], Root> = (options: ObsidiousOptions = {}): Transformer<Root, Root> => {

    const config: RemarkObsidiousOptions = {
        ...DefaultRemarkObsidiousOptions,
        ...options,
        classNames: {
            ...DefaultRemarkObsidiousOptions.classNames,
            ...options?.classNames,
        },
    };
    const visitObsidianEmbeds = createVisitObsidianEmbeds({ ...config });
    const visitObsidianHilights = createVisitObsidianHilights({ ...config });
    const visitObsidianCallouts = createVisitObsidianCallouts({ ...config });

    return (tree) => {
        visit(tree, 'text', visitObsidianHilights);
        visit(tree, 'text', visitObsidianEmbeds);
        visit(tree, 'blockquote', visitObsidianCallouts);
    };
}

export default RemarkObsidious;