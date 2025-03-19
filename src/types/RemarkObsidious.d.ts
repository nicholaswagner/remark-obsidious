import slugify from 'slugify';

type RemarkObsidiousOptions = {
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
    getFileMetaForLabel: (_label: string) => FileMeta | null;
};