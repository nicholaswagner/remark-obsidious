// src/ObsidiousVault.ts
var ObsidiousVaultImageFiletypes = ["avif", "bmp", "gif", "jpeg", "jpg", "png", "svg", "webp"];
var vaultData = null;
var initialize = (data) => {
  if (vaultData) return ObsidiousVault;
  vaultData = data;
  return ObsidiousVault;
};
var getFileForId = (id) => vaultData ? vaultData.files[id] || null : null;
var getFileForWebPathSlug = (webPath) => vaultData ? getFileForId(vaultData.idsByWebPath[webPath]) : null;
var getFileForLabelSlug = (labelSlug) => vaultData ? getFileForId(vaultData.idsByLabelSlug[labelSlug]) : null;
var getAllFiles = () => vaultData ? Object.values(vaultData.files) : [];
var getAllImageFiles = () => vaultData ? vaultData.imageIds.map(getFileForId).filter((item) => item !== null) : [];
var getFileTree = () => vaultData ? vaultData.fileTree : [];
var getFilesByExtension = (extension) => {
  const ids = vaultData ? vaultData.idsByExtension[extension] || [] : [];
  return ids.map(getFileForId).filter((item) => item !== null);
};
var ObsidiousVault = {
  initialize,
  getAllFiles,
  getAllImageFiles,
  getFileForId,
  getFileForLabelSlug,
  getFileForWebPathSlug,
  getFilesByExtension,
  getFileTree,
  ...vaultData || {}
};

// src/ObsidiousUtils.ts
var slugify = (str) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\/]+/g, "-").replace(/_+/g, "_").replace(/^_+|_+$/g, "");
var slugifyFilepath = (filepath, extension) => extension === "md" ? slugify(filepath.replace(/\.md$/, "")) : slugify(filepath);
function hash(str) {
  var h = 0;
  var k, i = 0, len = str.length;
  for (; len >= 4; ++i, len -= 4) {
    k = str.charCodeAt(i) & 255 | (str.charCodeAt(++i) & 255) << 8 | (str.charCodeAt(++i) & 255) << 16 | (str.charCodeAt(++i) & 255) << 24;
    k = /* Math.imul(k, m): */
    (k & 65535) * 1540483477 + ((k >>> 16) * 59797 << 16);
    k ^= /* k >>> r: */
    k >>> 24;
    h = /* Math.imul(k, m): */
    (k & 65535) * 1540483477 + ((k >>> 16) * 59797 << 16) ^ /* Math.imul(h, m): */
    (h & 65535) * 1540483477 + ((h >>> 16) * 59797 << 16);
  }
  switch (len) {
    case 3:
      h ^= (str.charCodeAt(i + 2) & 255) << 16;
    case 2:
      h ^= (str.charCodeAt(i + 1) & 255) << 8;
    case 1:
      h ^= str.charCodeAt(i) & 255;
      h = /* Math.imul(h, m): */
      (h & 65535) * 1540483477 + ((h >>> 16) * 59797 << 16);
  }
  h ^= h >>> 13;
  h = /* Math.imul(h, m): */
  (h & 65535) * 1540483477 + ((h >>> 16) * 59797 << 16);
  return ((h ^ h >>> 15) >>> 0).toString(36);
}

// node_modules/unist-util-is/lib/index.js
var convert = (
  // Note: overloads in JSDoc can’t yet use different `@template`s.
  /**
   * @type {(
   *   (<Condition extends string>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & {type: Condition}) &
   *   (<Condition extends Props>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Condition) &
   *   (<Condition extends TestFunction>(test: Condition) => (node: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node & Predicate<Condition, Node>) &
   *   ((test?: null | undefined) => (node?: unknown, index?: number | null | undefined, parent?: Parent | null | undefined, context?: unknown) => node is Node) &
   *   ((test?: Test) => Check)
   * )}
   */
  /**
   * @param {Test} [test]
   * @returns {Check}
   */
  function(test) {
    if (test === null || test === void 0) {
      return ok;
    }
    if (typeof test === "function") {
      return castFactory(test);
    }
    if (typeof test === "object") {
      return Array.isArray(test) ? anyFactory(test) : propsFactory(test);
    }
    if (typeof test === "string") {
      return typeFactory(test);
    }
    throw new Error("Expected function, string, or object as test");
  }
);
function anyFactory(tests) {
  const checks = [];
  let index = -1;
  while (++index < tests.length) {
    checks[index] = convert(tests[index]);
  }
  return castFactory(any);
  function any(...parameters) {
    let index2 = -1;
    while (++index2 < checks.length) {
      if (checks[index2].apply(this, parameters)) return true;
    }
    return false;
  }
}
function propsFactory(check) {
  const checkAsRecord = (
    /** @type {Record<string, unknown>} */
    check
  );
  return castFactory(all);
  function all(node) {
    const nodeAsRecord = (
      /** @type {Record<string, unknown>} */
      /** @type {unknown} */
      node
    );
    let key;
    for (key in check) {
      if (nodeAsRecord[key] !== checkAsRecord[key]) return false;
    }
    return true;
  }
}
function typeFactory(check) {
  return castFactory(type);
  function type(node) {
    return node && node.type === check;
  }
}
function castFactory(testFunction) {
  return check;
  function check(value, index, parent) {
    return Boolean(
      looksLikeANode(value) && testFunction.call(
        this,
        value,
        typeof index === "number" ? index : void 0,
        parent || void 0
      )
    );
  }
}
function ok() {
  return true;
}
function looksLikeANode(value) {
  return value !== null && typeof value === "object" && "type" in value;
}

// node_modules/unist-util-visit-parents/lib/color.js
function color(d) {
  return d;
}

// node_modules/unist-util-visit-parents/lib/index.js
var empty = [];
var CONTINUE = true;
var EXIT = false;
var SKIP = "skip";
function visitParents(tree, test, visitor, reverse) {
  let check;
  if (typeof test === "function" && typeof visitor !== "function") {
    reverse = visitor;
    visitor = test;
  } else {
    check = test;
  }
  const is2 = convert(check);
  const step = reverse ? -1 : 1;
  factory(tree, void 0, [])();
  function factory(node, index, parents) {
    const value = (
      /** @type {Record<string, unknown>} */
      node && typeof node === "object" ? node : {}
    );
    if (typeof value.type === "string") {
      const name = (
        // `hast`
        typeof value.tagName === "string" ? value.tagName : (
          // `xast`
          typeof value.name === "string" ? value.name : void 0
        )
      );
      Object.defineProperty(visit2, "name", {
        value: "node (" + color(node.type + (name ? "<" + name + ">" : "")) + ")"
      });
    }
    return visit2;
    function visit2() {
      let result = empty;
      let subresult;
      let offset;
      let grandparents;
      if (!test || is2(node, index, parents[parents.length - 1] || void 0)) {
        result = toResult(visitor(node, parents));
        if (result[0] === EXIT) {
          return result;
        }
      }
      if ("children" in node && node.children) {
        const nodeAsParent = (
          /** @type {UnistParent} */
          node
        );
        if (nodeAsParent.children && result[0] !== SKIP) {
          offset = (reverse ? nodeAsParent.children.length : -1) + step;
          grandparents = parents.concat(nodeAsParent);
          while (offset > -1 && offset < nodeAsParent.children.length) {
            const child = nodeAsParent.children[offset];
            subresult = factory(child, offset, grandparents)();
            if (subresult[0] === EXIT) {
              return subresult;
            }
            offset = typeof subresult[1] === "number" ? subresult[1] : offset + step;
          }
        }
      }
      return result;
    }
  }
}
function toResult(value) {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === "number") {
    return [CONTINUE, value];
  }
  return value === null || value === void 0 ? empty : [value];
}

// node_modules/unist-util-visit/lib/index.js
function visit(tree, testOrVisitor, visitorOrReverse, maybeReverse) {
  let reverse;
  let test;
  let visitor;
  if (typeof testOrVisitor === "function" && typeof visitorOrReverse !== "function") {
    test = void 0;
    visitor = testOrVisitor;
    reverse = visitorOrReverse;
  } else {
    test = testOrVisitor;
    visitor = visitorOrReverse;
    reverse = maybeReverse;
  }
  visitParents(tree, test, overload, reverse);
  function overload(node, parents) {
    const parent = parents[parents.length - 1];
    const index = parent ? parent.children.indexOf(node) : void 0;
    return visitor(node, index, parent);
  }
}

// src/createVisitObsidianEmbeds.ts
var obsidianEmbed = /!?\[\[[^\]]+\]\]/g;
var obsidianEmbedParams = /!?\[\[([^\|\]]+)(?:\s*\|\s*([^\|\]]+))?\]\]/;
var createVisitObsidianEmbeds = ({ basePath, classNames, filePathPrefix, getVaultItemByLabelSlug, slugify: slugify2 }) => {
  const { linkClassName, imageClassName, errorClassName, mdClassName } = classNames;
  return (node, index, parent) => {
    if (!node.value || typeof node.value !== "string" || !parent || index === void 0) return;
    if (!node.value?.match(obsidianEmbed)?.length) return;
    const matches = [...node.value.matchAll(obsidianEmbed)];
    const results = [];
    let bufferIndex = 0;
    for (const match of matches) {
      if (bufferIndex !== match.index) {
        results.push({ type: "text", value: node.value.slice(bufferIndex, match.index) });
      }
      const params = match[0].match(obsidianEmbedParams);
      if (!params) {
        results.push({ type: "text", value: match[0] });
        bufferIndex = match.index + match[0].length;
        continue;
      }
      const urlParamsIndex = params[1].indexOf("#");
      const urlParams = urlParamsIndex !== -1 ? params[1].slice(urlParamsIndex + 1).trim() : "";
      const isCarotParams = urlParams.startsWith("^");
      const vaultItem = getVaultItemByLabelSlug(urlParamsIndex !== -1 ? slugify2(params[1].slice(0, urlParamsIndex).trim()) : slugify2(params[1].trim()));
      const title = isCarotParams ? `${vaultItem?.label} > ${urlParams.slice(1)}` : params[1];
      const fileUrl = `${filePathPrefix}${vaultItem?.filepath}`.replace(/\/\//g, "/");
      if (!vaultItem) {
        console.error(vaultItem);
        results.push({
          type: "text",
          value: `"${params[1]}" could not be found`,
          data: { hName: "span", hProperties: { className: errorClassName } }
        });
      } else {
        if (params[0].startsWith("!")) {
          if (vaultItem.extension === "md") {
            parent.data = {
              ...parent.data,
              hName: "div",
              hProperties: {
                className: mdClassName,
                options: params[2] ?? void 0,
                "data-file-id": vaultItem.id,
                "data-hash-params": slugify2(urlParams)
              }
            };
          } else {
            results.push({
              type: "image",
              url: fileUrl,
              alt: title,
              data: {
                hProperties: {
                  className: imageClassName,
                  options: params[2] ?? void 0,
                  src: fileUrl,
                  "data-ext": vaultItem.extension,
                  "data-label": vaultItem.label
                }
              }
            });
          }
        } else {
          const hash2 = urlParams ? `#${slugify2(urlParams)}` : "";
          results.push({
            type: "link",
            url: fileUrl + hash2,
            title: params[2] ?? title,
            data: {
              hProperties: {
                className: linkClassName,
                options: params[2] ?? void 0,
                src: fileUrl,
                "data-ext": vaultItem.extension,
                "data-hash-params": slugify2(urlParams),
                "data-label": vaultItem.label
              }
            },
            children: [{ type: "text", value: params[2] ?? title }]
          });
        }
      }
      bufferIndex = match.index + match[0].length;
    }
    if (bufferIndex < node.value.length) {
      results.push({ type: "text", value: node.value.slice(bufferIndex) });
    }
    if (typeof index === "number" && parent.children) {
      parent.children.splice(index, 1, ...results);
    } else {
      parent.children = results;
    }
  };
};
var createVisitObsidianEmbeds_default = createVisitObsidianEmbeds;

// src/createVisitObsidianCallouts.ts
var calloutRegex = /^\[\!\s*([\w-]+)\s*\]([-+]?)/;
var createVisitObsidianCallouts = ({ classNames }) => {
  const { calloutClassName, calloutIsFoldableClassName, calloutTitleClassName } = classNames;
  return (blockquoteNode) => {
    if (!Array.isArray(blockquoteNode.children) || blockquoteNode.children.length === 0) return;
    const firstParagraph = blockquoteNode.children.find((child) => child.type === "paragraph");
    if (!firstParagraph || firstParagraph.children.length === 0) return;
    const firstTextNode = firstParagraph.children.find((child) => child.type === "text");
    if (!firstTextNode || typeof firstTextNode.value !== "string" || firstTextNode.value.trim() === "") return;
    const match = calloutRegex.exec(firstTextNode.value);
    if (!match) return;
    const calloutType = match[1].toLowerCase();
    const foldableModifier = match[2] || "";
    const isFoldable = foldableModifier !== "";
    const initialFolded = foldableModifier === "-";
    firstTextNode.value = firstTextNode.value.replace(calloutRegex, "").trim();
    const titleText = firstTextNode.value || calloutType;
    blockquoteNode.data ??= {};
    blockquoteNode.data.hProperties = {
      ...blockquoteNode.data.hProperties,
      "data-callout": calloutType,
      "data-initial-folded": String(initialFolded),
      "data-title": titleText,
      className: [calloutClassName, isFoldable ? calloutIsFoldableClassName : ""]
    };
    firstParagraph.data ??= {};
    if (!firstParagraph.data.hProperties) firstParagraph.data.hProperties = {};
    firstParagraph.data.hProperties = {
      ...firstParagraph.data.hProperties,
      className: [calloutTitleClassName],
      "data-callout": calloutType,
      "data-title": titleText
    };
  };
};
var createVisitObsidianCallouts_default = createVisitObsidianCallouts;

// src/createVisitObsidianHilights.ts
var hilight = /==([^=]+)==/gm;
var createVisitObsidianHilights = ({ classNames }) => {
  const { hilightClassName } = classNames;
  return (node, index, parent) => {
    if (!node.value || typeof node.value !== "string" || !parent || index === void 0) return;
    const matches = [...node.value.matchAll(hilight)];
    if (matches.length === 0) return;
    const results = [];
    let bufferIndex = 0;
    for (const match of matches) {
      if (bufferIndex !== match.index) {
        results.push({ type: "text", value: node.value.slice(bufferIndex, match.index) });
      }
      results.push({
        type: "text",
        value: match[1],
        data: { hName: "mark", hProperties: { className: hilightClassName } }
      });
      bufferIndex = match.index + match[0].length;
    }
    if (bufferIndex < node.value.length)
      results.push({ type: "text", value: node.value.slice(bufferIndex) });
    if (parent.children) {
      parent.children.splice(index, 1, ...results);
    }
  };
};
var createVisitObsidianHilights_default = createVisitObsidianHilights;

// src/RemarkObsidious.ts
var DefaultRemarkObsidiousOptions = {
  basePath: "",
  classNames: {
    calloutClassName: "callout",
    calloutIsFoldableClassName: "foldable",
    calloutTitleClassName: "callout-title",
    errorClassName: "obsidian-md-error",
    hilightClassName: "obsidian-hilight",
    imageClassName: "obsidian-img",
    linkClassName: "obsidian-link",
    mdClassName: "obsidian-md-embed "
  },
  filePathPrefix: "",
  slugify,
  getVaultItemByLabelSlug: (labelSlug) => ObsidiousVault.getFileForLabelSlug(labelSlug)
};
var RemarkObsidious = (options = {}) => {
  const config = {
    ...DefaultRemarkObsidiousOptions,
    ...options,
    classNames: {
      ...DefaultRemarkObsidiousOptions.classNames,
      ...options?.classNames
    }
  };
  const visitObsidianEmbeds = createVisitObsidianEmbeds_default({ ...config });
  const visitObsidianCallouts = createVisitObsidianCallouts_default({ ...config });
  const visitObsidianHilights = createVisitObsidianHilights_default({ ...config });
  return (tree) => {
    visit(tree, "blockquote", visitObsidianCallouts);
    visit(tree, "text", visitObsidianHilights);
    visit(tree, "text", visitObsidianEmbeds);
  };
};
var RemarkObsidious_default = RemarkObsidious;
export {
  DefaultRemarkObsidiousOptions,
  ObsidiousVault,
  ObsidiousVaultImageFiletypes,
  hash,
  RemarkObsidious_default as remarkObsidious,
  slugify,
  slugifyFilepath
};
//# sourceMappingURL=index.js.map
