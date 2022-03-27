const footnotes = function(hook) {
  hook.beforeEach(function (html) {
    if (/\[\^([A-Za-z0-9]+)\][^:]/.test(html)) {
      html = html
        .replace(/\[\^([A-Za-z0-9]+)\][^:]/gm, '<sup class="footnote-symbol" id="fn-$1">[\[$1]\](#fnref-$1)</sup>')
        .replace(/\[\^([A-Za-z0-9]+)\]\: /gm, '<strong class="footnote-reference-symbol" id="fnref-$1">[\[$1\]](#fn-$1)</strong>:leftwards_arrow_with_hook: ');
    }
    return html;
  });
};

$docsify = $docsify || {};
$docsify.plugins = [].concat(footnotes, $docsify.plugins || []);
