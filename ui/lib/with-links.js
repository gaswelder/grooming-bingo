const unique = a => [...new Set(a)];

/**
 * Wraps recognized web links in the given string with
 * HTML <a> tags.
 *
 * @param {string} text
 * @returns {string}
 */
export function withLinks(text) {
  let result = text;
  for (const url of unique(findLinks(text))) {
    result = result.replace(url, `<a target="_blank" href="${url}">${url}</a>`);
  }
  return result;
}

/**
 * Returns the list of URLs found in the given text.
 *
 * @param {string} text
 * @returns {string[]}
 */
function findLinks(text) {
  const p = /https?:\/\/\w+\.\w+(\.\w+)*/g;
  return [...text.matchAll(p)].map(m => m[0]);
}