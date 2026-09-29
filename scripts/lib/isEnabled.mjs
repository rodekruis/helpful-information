/**
 * Turn similar string-values into a true boolean result.
 *
 * @param {string|number|boolean|undefined|null} value
 * @returns {boolean}
 */
export function isEnabled(value) {
  const positiveValues = ['true', '1', 'yes', 'y', 'on', 'enable', 'enabled'];

  if (typeof value === 'boolean') {
    return value === true;
  }
  if (typeof value === 'number') {
    return value === 1;
  }
  if (typeof value === 'string') {
    return positiveValues.includes(value.toLowerCase());
  }

  return false;
}
