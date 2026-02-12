/**
 * @typedef {Object} HIAConfig
 * @property {Array<RegionSet>} regionSets
 */

/**
 * @typedef {Object} RegionSet
 * @property {Array<Region>} regions
 */

/**
 * @typedef {Object} Region
 * @property {string} sheetId
 */

/**
 * Extracts all `sheetId`s from the configuration.
 *
 * @param {HIAConfig} config
 *
 * @returns {string[]}
 */
export function getSheetIdsFromConfig(config) {
  const sheetIds = [];

  if (!config.regionSets || !Array.isArray(config.regionSets)) {
    return sheetIds;
  }

  config.regionSets.forEach((regionSet) => {
    if (regionSet.regions && Array.isArray(regionSet.regions)) {
      regionSet.regions.forEach((region) => {
        if (region.sheetId) {
          sheetIds.push(region.sheetId);
        }
      });
    }
  });

  return sheetIds;
}
