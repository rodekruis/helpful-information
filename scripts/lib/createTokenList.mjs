/**
 * Turn a comma-separated string into an array of (trimmed) strings.
 *
 * @param {string} value
 * @returns {string[]}
 */
export function createTokenList(value) {
  return value
    .trim()
    .split(/\s*,\s*/)
    .map((s /* @type {string} */) => s.trim());
}
