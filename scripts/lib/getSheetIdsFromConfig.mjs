/**
 * Extracts all `sheetId`s from the configuration.
 *
 * @param {Object} config
 * @param {Array<Object>} config.regionSets
 * @param {Array<Object>} config.regionSets[].regions
 * @param {string} config.regionSets[].regions[].sheetId
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
