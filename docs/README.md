# Footnotes

[![](https://data.jsdelivr.com/v1/package/npm/@sy-records/docsify-footnotes/badge)](https://www.jsdelivr.com/package/npm/@sy-records/docsify-footnotes)
[![](https://img.shields.io/npm/v/@sy-records/docsify-footnotes.svg?style=flat-square)](https://www.npmjs.com/package/@sy-records/docsify-footnotes)
[![](https://img.shields.io/npm/l/@sy-records/docsify-footnotes)](https://github.com/sy-records/docsify-footnotes/blob/master/LICENSE)
[![Test](https://github.com/sy-records/docsify-footnotes/actions/workflows/test.yml/badge.svg)](https://github.com/sy-records/docsify-footnotes/actions/workflows/test.yml)

A plugin that supports the use of footnotes in docsify.

## Usage

```html
<script src="//cdn.jsdelivr.net/npm/@sy-records/docsify-footnotes@2/dist/index.min.js"></script>
```

## Configuration

You can configure the plugin by setting `footnotes` in your `$docsify` config object.

| Option | Type | Default                          | Description |
|---|---|----------------------------------|---|
| `backlinkIcon` | `string` | `':leftwards_arrow_with_hook:'` :leftwards_arrow_with_hook: | The icon rendered after each footnote definition as a backlink. Accepts an emoji, a Unicode character, an HTML entity string, or any arbitrary HTML. Set to `''` to disable the backlink icon entirely. |

### Examples

```js
window.$docsify = {
  footnotes: {
    // Default: emoji (may render large on some platforms)
    backlinkIcon: ':leftwards_arrow_with_hook:', // ↩

    // Unicode text glyph (avoids emoji scaling, recommended)
    backlinkIcon: '&#x21a9;&#xfe0e;',

    // Any HTML is accepted
    backlinkIcon: '<span class="footnote-backlink" aria-label="Back to reference" style="font-size:0.75em;line-height:1;">↩</span>',

    // Disable the backlink icon
    backlinkIcon: '',
  }
}
```

## Basic Syntax

### Adding Footnotes

Creating footnotes in Markdown consists of two parts: the footnote marker and the footnote content.

```markup
This is a paragraph containing a footnote[^1].

[^1]: This is the footnote content.
```

<output data-lang="output">

This is a paragraph containing a footnote[^1].

[^1]: This is the footnote content.

</output>

### Multiple Footnotes

```markup
Markdown is a lightweight markup language[^1] created by John Gruber[^2], now widely used in writing[^3].

[^1]: Markdown uses simple syntax to achieve text formatting.  
[^2]: John Gruber created Markdown in 2004.  
[^3]: Many platforms such as GitHub, Stack Overflow, and blog platforms support Markdown.
```

<output data-lang="output">

Markdown is a lightweight markup language[^1] created by John Gruber[^2], now widely used in writing[^3].

[^1]: Markdown uses simple syntax to achieve text formatting.  
[^2]: John Gruber created Markdown in 2004.  
[^3]: Many platforms such as GitHub, Stack Overflow, and blog platforms support Markdown.

</output>

### Advanced Usage

#### Footnote Identifiers

Footnote identifiers can be numbers or words, but cannot contain spaces or tabs.

```markup
Here is a regular footnote[^1] and a footnote with an identifier[^note].

[^1]: This is a regular footnote.
[^note]: This is a footnote with an identifier.
```

<output data-lang="output">

Here is a regular footnote[^1] and a footnote with an identifier[^note].

[^1]: This is a regular footnote.
[^note]: This is a footnote with an identifier.

</output>

#### Multi-paragraph Footnotes

Footnote content can contain multiple paragraphs or other elements, requiring proper indentation.

```markup
This is a footnote containing multiple paragraphs[^multipara].

[^multipara]: This is the first paragraph of the footnote.

    This is the second paragraph of the footnote. Indent at least four spaces or one tab.

    > You can also include blockquotes in footnotes.

    - You can also include lists
    - Both ordered and unordered lists are supported
```

<output data-lang="output">

This is a footnote containing multiple paragraphs[^multipara].

[^multipara]: This is the first paragraph of the footnote.

    This is the second paragraph of the footnote. Indent at least four spaces or one tab.

    > You can also include blockquotes in footnotes.

    - You can also include lists
    - Both ordered and unordered lists are supported

</output>

#### Inline Footnotes

Some Markdown implementations support inline footnote syntax, but this is not part of standard Markdown.

```markup
This is an inline footnote^[Add footnote content directly in the text rather than at the end of the document].
```

<output data-lang="output">

This is an inline footnote^[Add footnote content directly in the text rather than at the end of the document].

</output>
