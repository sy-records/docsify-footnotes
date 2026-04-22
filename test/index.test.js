const test = require('node:test');
const assert = require('node:assert/strict');

const { transformFootnotesMarkdown } = require('../src/index.js');

test('supports inline footnote syntax label^[definition] by generating references', () => {
  const input = 'Abbreviation tf^[Test File].';
  const output = transformFootnotesMarkdown(input, {});

  assert.match(output, /id="fn-1"/);
  assert.match(output, /id="fnref-1"/);
  assert.match(output, /Test File/);
});

test('duplicate inline labels are reordered to new unique ids', () => {
  const input = 'tf^[Test File] and tf^[Tunable Field].';
  const output = transformFootnotesMarkdown(input, {});

  assert.match(output, /id="fn-1"/);
  assert.match(output, /id="fn-2"/);
  assert.match(output, /Tunable Field/);
});

test('existing ids are preserved and inline duplicates get a new id', () => {
  const input = 'Existing[^inline-tf-1].\n\n[^inline-tf-1]: Existing definition\n\nThen tf^[Test File].';
  const output = transformFootnotesMarkdown(input, {});

  assert.match(output, /id="fn-inline-tf-1"/);
  assert.match(output, /id="fn-1"/);
  assert.match(output, /id="fnref-1"/);
});

test('English regular ids are preserved without force renumber', () => {
  const input = 'Keep[^bignote].\n\n[^bignote]: Keep id.';
  const output = transformFootnotesMarkdown(input, {});

  assert.match(output, /id="fn-bignote"/);
  assert.match(output, /id="fnref-bignote"/);
});

test('numeric regular ids are force-renumbered in appearance order', () => {
  const input = [
    'first[^10] and second[^2]',
    '',
    '[^2]: Second definition',
    '[^10]: First definition',
  ].join('\n');
  const output = transformFootnotesMarkdown(input, {});

  assert.match(output, /id="fn-1"/);
  assert.match(output, /id="fn-2"/);
  assert.match(output, /id="fnref-1"/);
  assert.match(output, /id="fnref-2"/);
  assert.doesNotMatch(output, /id="fn-10"/);
});

test('duplicate numeric ids are remapped to ordered unique numeric ids', () => {
  const input = [
    'first[^3] and second[^3]',
    '',
    '[^3]: First definition',
    '[^3]: Second definition',
  ].join('\n');
  const output = transformFootnotesMarkdown(input, {});

  assert.match(output, /id="fn-1"/);
  assert.match(output, /id="fn-2"/);
  assert.match(output, /id="fnref-1"/);
  assert.match(output, /id="fnref-2"/);
  assert.doesNotMatch(output, /id="fn-3"/);
});

test('does not parse inline footnotes inside code spans or fenced code blocks', () => {
  const input = [
    'Code span `tf^[Test File]` should stay literal.',
    '',
    '```js',
    'const x = "tf^[Test File]";',
    '```',
  ].join('\n');

  const output = transformFootnotesMarkdown(input, {});

  assert.match(output, /`tf\^\[Test File]`/);
  assert.match(output, /const x = "tf\^\[Test File]";/);
  assert.doesNotMatch(output, /fn-1/);
});

test('footnote definitions are separated with explicit breaks', () => {
  const input = [
    'A[^1] and B[^2].',
    '',
    '[^1]: First',
    '[^2]: Second',
  ].join('\n');
  const output = transformFootnotesMarkdown(input, {});

  assert.match(output, /\(#fn-1\)<br>\n<span class="footnote-reference-symbol" data-ref="fn-2" id="fnref-2">2:<\/span> Second/);
});

