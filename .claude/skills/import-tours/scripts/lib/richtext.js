/**
 * Converts a cheerio/domhandler element's inline content (text + <strong>/<b>,
 * <em>/<i>, <a href>) into a Prismic RichText node: { type, text, spans }.
 */

function walk(node, state) {
  const children = node.children || [];
  for (const child of children) {
    if (child.type === "text") {
      state.text += child.data;
      continue;
    }
    if (child.type !== "tag") continue;

    const start = state.text.length;
    walk(child, state);
    const end = state.text.length;
    if (end === start) continue;

    if (child.name === "a" && child.attribs && child.attribs.href) {
      state.spans.push({
        type: "hyperlink",
        start,
        end,
        data: { link_type: "Web", url: child.attribs.href },
      });
    } else if (child.name === "strong" || child.name === "b") {
      state.spans.push({ type: "strong", start, end });
    } else if (child.name === "em" || child.name === "i") {
      state.spans.push({ type: "em", start, end });
    }
  }
}

function elementToRichTextNode(el, type) {
  const state = { text: "", spans: [] };
  walk(el, state);

  const trimmedStart = state.text.length - state.text.trimStart().length;
  const text = state.text.trim();
  const maxLen = text.length;

  const spans = state.spans
    .map((span) => ({
      ...span,
      start: Math.max(0, Math.min(span.start - trimmedStart, maxLen)),
      end: Math.max(0, Math.min(span.end - trimmedStart, maxLen)),
    }))
    .filter((span) => span.end > span.start);

  return { type, text, spans };
}

/** Converts a set of <p> elements into paragraph RichText nodes (empty paragraphs skipped). */
function paragraphsToRichText(paragraphEls) {
  return paragraphEls
    .map((el) => elementToRichTextNode(el, "paragraph"))
    .filter((node) => node.text.length > 0);
}

/** Converts a set of <li> elements into list-item RichText nodes (empty items skipped). */
function listItemsToRichText(liEls) {
  return liEls
    .map((el) => elementToRichTextNode(el, "list-item"))
    .filter((node) => node.text.length > 0);
}

/** Plain text of an element, whitespace-normalized. */
function textOf($, el) {
  return $(el).text().replace(/\s+/g, " ").trim();
}

module.exports = {
  elementToRichTextNode,
  paragraphsToRichText,
  listItemsToRichText,
  textOf,
};
