function protectCodeBlocks(markdown) {
  const codeBlocks = [];
  const placeholder = (i) => `{{DOCSIFYFOOTNOTESCODE${i}}}`;

  const protectedMarkdown = markdown.replace(/(```[\s\S]*?```|`[^`\n]+`)/g, (match) => {
    const index = codeBlocks.length;
    codeBlocks.push(match);
    return placeholder(index);
  });

  return { protectedMarkdown, codeBlocks };
}

function restoreCodeBlocks(markdown, codeBlocks) {
  return markdown.replace(/\{\{DOCSIFYFOOTNOTESCODE(\d+)}}/g, (_, index) => codeBlocks[+index]);
}

function remapNumericFootnoteIds(markdown) {
  const isNumericId = (id) => /^\d+$/.test(id);
  const definitionCountById = {};
  markdown.replace(/\[\^([A-Za-z0-9-]+)](:)?/g, (_, id, isDefinition) => {
    if (isDefinition && isNumericId(id)) {
      definitionCountById[id] = (definitionCountById[id] || 0) + 1;
    }
    return _;
  });

  if (!Object.keys(definitionCountById).length) return markdown;

  const duplicateIdSet = new Set(Object.keys(definitionCountById).filter((id) => definitionCountById[id] > 1));
  const singleIdMap = {};
  const duplicateIdMaps = {};
  let nextId = 1;

  const refCursorById = {};
  const defCursorById = {};

  return markdown.replace(/\[\^([A-Za-z0-9-]+)](:)?/g, (_, id, isDefinition) => {
    if (!isNumericId(id)) return _;

    if (!duplicateIdSet.has(id)) {
      if (!singleIdMap[id]) {
        singleIdMap[id] = String(nextId++);
      }
      return isDefinition ? `[^${singleIdMap[id]}]:` : `[^${singleIdMap[id]}]`;
    }

    duplicateIdMaps[id] = duplicateIdMaps[id] || [];
    const maxIndex = definitionCountById[id] - 1;

    if (isDefinition) {
      const index = defCursorById[id] || 0;
      const targetIndex = Math.min(index, maxIndex);
      if (!duplicateIdMaps[id][targetIndex]) {
        duplicateIdMaps[id][targetIndex] = String(nextId++);
      }
      defCursorById[id] = index + 1;
      return `[^${duplicateIdMaps[id][targetIndex]}]:`;
    }

    const index = refCursorById[id] || 0;
    const targetIndex = Math.min(index, maxIndex);
    if (!duplicateIdMaps[id][targetIndex]) {
      duplicateIdMaps[id][targetIndex] = String(nextId++);
    }
    refCursorById[id] = index + 1;
    return `[^${duplicateIdMaps[id][targetIndex]}]`;
  });
}

function buildInlineFootnoteId(usedIds, counters) {
  let next = counters.nextNumericId;
  let id = String(next);
  while (usedIds.has(id)) {
    next += 1;
    id = String(next);
  }

  counters.nextNumericId = next + 1;
  usedIds.add(id);
  return id;
}

function expandInlineFootnotes(markdown) {
  const usedIds = new Set();
  markdown.replace(/\[\^([A-Za-z0-9-]+)](:)?/g, (_, id) => {
    usedIds.add(id);
    return _;
  });

  let maxNumericId = 0;
  usedIds.forEach((id) => {
    if (/^\d+$/.test(id)) {
      maxNumericId = Math.max(maxNumericId, Number(id));
    }
  });

  const counters = { nextNumericId: maxNumericId + 1 };
  const definitions = [];
  const transformed = markdown.replace(/([A-Za-z0-9][A-Za-z0-9_-]*)\^\[([^\]\n]+)]/g, (_, label, definition) => {
    const id = buildInlineFootnoteId(usedIds, counters);
    definitions.push(`[^${id}]: ${definition.trim()}`);
    return `${label}[^${id}]`;
  });

  if (!definitions.length) return markdown;
  return `${transformed}\n\n${definitions.join('\n')}`;
}

function transformFootnotesMarkdown(markdown, options) {
  const backlinkIcon = options.backlinkIcon !== undefined ? options.backlinkIcon : ':leftwards_arrow_with_hook:';
  const { protectedMarkdown, codeBlocks } = protectCodeBlocks(markdown);
  const inlineExpandedMarkdown = expandInlineFootnotes(protectedMarkdown);
  const remappedMarkdown = remapNumericFootnoteIds(inlineExpandedMarkdown);

  const processed = remappedMarkdown.replace(/\[\^([A-Za-z0-9-]+)](:)?/gm, (_, id, isDefinition) =>
    isDefinition
      ? `<strong class="footnote-reference-symbol" data-ref="fn-${id}" id="fnref-${id}">[${id}](#fn-${id})</strong>${backlinkIcon} `
      : `<sup class="footnote-symbol" data-ref="fnref-${id}" id="fn-${id}">[[${id}]](#fnref-${id})</sup>`
  );

  return restoreCodeBlocks(processed, codeBlocks);
}

if (typeof document !== 'undefined') {
  document.addEventListener('click', function (event) {
    const target = event.target.closest('.footnote-symbol, .footnote-reference-symbol');
    if (!target?.dataset.ref) return;

    const footnotesElm = Docsify.dom.find(`.markdown-section :where(.footnote-symbol, .footnote-reference-symbol)[id="${target.dataset.ref}"]`);
    footnotesElm?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function footnotes(hook) {
  hook.beforeEach((markdown) => {
    const options = window.$docsify?.footnotes || {};
    return transformFootnotesMarkdown(markdown, options);
  });
}

if (typeof window !== 'undefined') {
  window.$docsify = window.$docsify || {};
  $docsify.plugins = [...($docsify.plugins || []), footnotes];
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    transformFootnotesMarkdown,
  };
}
