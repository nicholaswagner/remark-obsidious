import { Visitor } from 'unist-util-visit';
import { Literal, PhrasingContent } from 'mdast';
import { RemarkObsidiousOptions } from './RemarkObsidious';
import { slugifyFilepath } from './ObsidiousUtils';

const obsidianEmbed = /!?\[\[[^\]]+\]\]/g; // Matches all the ![[...]] in the markdown
const obsidianEmbedParams = /!?\[\[([^\|\]]+)(?:\s*\|\s*([^\|\]]+))?\]\]/; // Captures the link and optional alias from inside the ![[...]]


/**
 * Creates a visitor function that processes Obsidian links and embeds in markdown nodes.
 * When links are encountered, 
 */
const createVisitObsidianEmbeds = ({ basePath, classNames, filePathPrefix, getVaultItemByLabelSlug, slugify }: RemarkObsidiousOptions): Visitor<Literal> => {
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
            const vaultItem = getVaultItemByLabelSlug(urlParamsIndex !== -1 ? slugify(params[1].slice(0, urlParamsIndex)) : slugify(params[1]));
            const title = isCarotParams ? `${vaultItem?.label} > ${urlParams.slice(1)}` : params[1];

            if (!vaultItem) {
                console.error(vaultItem);
                results.push({
                    type: 'text',
                    value: `"${params[1]}" could not be found`,
                    data: { hName: 'span', hProperties: { className: errorClassName } },
                });
            } else {
                if (params[0].startsWith('!')) {
                    const src = vaultItem.filepath;

                    if (vaultItem.extension === 'md') {
                        /** if embedding a markdown file, change the parent element from <p> to <div> */
                        parent.data = {
                            ...parent.data,
                            hName: 'div',
                            hProperties: {
                                className: embeddedMdClassName,
                                options: params[2] ?? undefined,
                                'data-file-id': vaultItem.id,
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
                                    'data-ext': vaultItem.extension,
                                    'data-hash-params': slugify(urlParams),
                                    'data-label': vaultItem.label,
                                },
                            },
                        });
                    }

                } else {
                    const hash = urlParams ? `#${slugify(urlParams)}` : '';
                    results.push({
                        type: 'link',
                        url: basePath + slugifyFilepath(vaultItem.filepath, vaultItem.extension) + hash,
                        title: params[2] ?? title,
                        data: {
                            hProperties: {
                                className: linkClassName,
                                options: params[2] ?? undefined,
                                src: filePathPrefix + vaultItem.filepath,
                                'data-ext': vaultItem.extension,
                                'data-hash-params': slugify(urlParams),
                                'data-label': vaultItem.label,
                            },
                        },
                        children: [{ type: 'text', value: params[2] ?? title }],
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