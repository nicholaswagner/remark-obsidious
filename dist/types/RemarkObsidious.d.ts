import { Plugin } from "unified";
import { Root } from 'mdast';
import { slugify } from './ObsidiousUtils';
import { type ObsidiousVaultItem } from './ObsidiousVault';
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
        embeddedMdClassName: string;
    };
    filePathPrefix: string;
    slugify: typeof slugify;
    getVaultItemByLabelSlug: (labelSlug: string) => ObsidiousVaultItem | null;
};
export type ObsidiousOptions = Partial<RemarkObsidiousOptions>;
declare const RemarkObsidious: Plugin<[ObsidiousOptions], Root>;
export default RemarkObsidious;
//# sourceMappingURL=RemarkObsidious.d.ts.map