import { Visitor } from 'unist-util-visit';
import { Literal, PhrasingContent } from 'mdast';
import { RemarkObsidiousOptions } from './types/RemarkObsidious';
import { slugifyFilepath } from './utils';

const obsidianEmbed = /!?\[\[[^\]]+\]\]/g; // Matches all the ![[...]] in the markdown
const obsidianEmbedParams = /!?\[\[([^\|\]]+)(?:\s*\|\s*([^\|\]]+))?\]\]/; // Captures the link and optional alias from inside the ![[...]]


/**
 * Creates a visitor function that processes Obsidian links and embeds in markdown nodes.
 * When links are encountered, 
 */
const createVisitObsidianEmbeds = ({ basePath, classNames, filePathPrefix, getFileMetaForLabel, slugify }: RemarkObsidiousOptions): Visitor<Literal> => {
    const { linkClassName, imageClassName, errorClassName, embeddedMdClassName } = classNames;
    return (node, index, parent) => {
        if (!node.value || typeof node.value !== 'string' || !parent || index === undefined) return;

        if (!node.value?.match(obsidianEmbed)?.length) return;

        const matches = [...node.value.matchAll(obsidianEmbed)];
        const results: PhrasingContent[] = [];
        let bufferIndex = 0;

        for (const match of matches) {
            if (bufferIndex !== match.index) {
                results.push({ type: 'text', value: node.value.slice(bufferIndex, match.index) });
            }
            const params = match[0].match(obsidianEmbedParams);
            if (!params) {
                results.push({ type: 'text', value: match[0] });
                bufferIndex = match.index + match[0].length;
                continue;
            }
            const urlParamsIndex = params[1].indexOf('#');
            const urlParams = urlParamsIndex !== -1 ? params[1].slice(urlParamsIndex + 1) : '';
            const isCarotParams = urlParams.startsWith('^');
            const file = getFileMetaForLabel(urlParamsIndex !== -1 ? slugify(params[1].slice(0, urlParamsIndex)) : slugify(params[1]));
            const title = isCarotParams ? `${file?.label} > ${urlParams.slice(1)}` : params[1];

            if (!file) {
                console.error(file);
                results.push({
                    type: 'text',
                    value: `"${params[1]}" could not be found`,
                    data: { hName: 'span', hProperties: { className: errorClassName } },
                });
            } else {
                if (params[0].startsWith('!')) {
                    const src = file.filepath;

                    if (file.extension === 'md') {
                        /** if embedding a markdown file, change the parent element from <p> to <div> */
                        parent.data = {
                            ...parent.data,
                            hName: 'div',
                            hProperties: {
                                className: embeddedMdClassName,
                                options: params[2] ?? undefined,
                                'data-file-id': file.id,
                                'data-hash-params': slugify(urlParams),
                            }
                        }
                    }
                    else {
                        results.push({
                            type: 'image',
                            url: src,
                            alt: title,
                            data: {
                                hProperties: {
                                    className: imageClassName,
                                    options: params[2] ?? undefined,
                                    src: filePathPrefix + src,
                                    'data-ext': file.extension,
                                    'data-hash-params': slugify(urlParams),
                                    'data-label': file.label,
                                },
                            },
                        });
                    }

                } else {
                    results.push({
                        type: 'link',
                        url: basePath + slugifyFilepath(file.filepath, file.extension) + urlParams,
                        title,
                        data: {
                            hProperties: {
                                className: linkClassName,
                                options: params[2] ?? undefined,
                                src: filePathPrefix + file.filepath,
                                'data-ext': file.extension,
                                'data-hash-params': slugify(urlParams),
                                'data-label': file.label,
                            },
                        },
                        children: [{ type: 'text', value: title }],
                    });
                }
            }
            bufferIndex = match.index + match[0].length;
        }
        // Add any remaining text after the last match
        if (bufferIndex < node.value.length) {
            results.push({ type: 'text', value: node.value.slice(bufferIndex) });
        }

        if (typeof index === 'number' && parent.children) {
            parent.children.splice(index, 1, ...results);
        } else {
            parent.children = results;
        }
    }
}

export default createVisitObsidianEmbeds;