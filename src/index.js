document.addEventListener('click', function (event) {
  const target = event.target.closest('.footnote-symbol, .footnote-reference-symbol');
  if (!target?.dataset.ref) return;

  const footnotesElm = Docsify.dom.find(`.markdown-section :where(.footnote-symbol, .footnote-reference-symbol)[id="${target.dataset.ref}"]`);
  footnotesElm?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

function footnotes(hook) {
  hook.beforeEach((markdown) => {
    const codeBlocks = [];
    const placeholder = (i) => `{{CODE${i}}}`;

    const protectedMarkdown = markdown.replace(/(```[\s\S]*?```|`[^`\n]+`)/g, (match) => {
      const index = codeBlocks.length;
      codeBlocks.push(match);
      return placeholder(index);
    });

    console.error(protectedMarkdown)

    const processed = protectedMarkdown.replace(/\[\^([A-Za-z0-9\-]+)\](\:)?/gm, (_, id, isDefinition) =>
        isDefinition
            ? `<strong class="footnote-reference-symbol" data-ref="fn-${id}" id="fnref-${id}">[${id}](#fn-${id})</strong>:leftwards_arrow_with_hook: `
            : `<sup class="footnote-symbol" data-ref="fnref-${id}" id="fn-${id}">[${id}](#fnref-${id})</sup>`
    );

    return processed.replace(/\{\{CODE(\d+)\}\}/g, (_, index) => codeBlocks[+index]);
  });
}

window.$docsify = window.$docsify || {};
$docsify.plugins = [...($docsify.plugins || []), footnotes];
