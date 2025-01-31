document.addEventListener('click', function (event) {
  const target = event.target.closest('.footnote-symbol, .footnote-reference-symbol');

  if (!target || !target.hasAttribute('data-id')) return;

  const dataId = target.getAttribute('data-id');

  const footnotesElm = Docsify.dom.find(`.markdown-section :where(sup, strong)[id="${dataId}"]`);

  if (footnotesElm) {
    footnotesElm.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
});

function footnotes(hook) {
  hook.beforeEach(function (markdown) {
    if (/\[\^([A-Za-z0-9\-]+)\][^:]/.test(markdown)) {
      markdown = markdown
          .replace(/\[\^([A-Za-z0-9\-]+)\][^:]/gm, '<sup class="footnote-symbol" data-id="fnref-$1" id="fn-$1">[\[$1]\](#fnref-$1)</sup>')
          .replace(/\[\^([A-Za-z0-9\-]+)\]\: /gm, '<strong class="footnote-reference-symbol" data-id="fn-$1" id="fnref-$1">[\[$1\]](#fn-$1)</strong>:leftwards_arrow_with_hook: ');
    }

    return markdown;
  });
}

window.$docsify = window.$docsify || {};
$docsify.plugins = [...($docsify.plugins || []), footnotes];
