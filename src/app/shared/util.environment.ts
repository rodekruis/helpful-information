import { environment } from 'src/environments/environment';

function createTokenList(value: string): string[] {
  return value
    .trim()
    .split(/\s*,\s*/)
    .map((s) => s.trim());
}

export function createRegionSlugs(
  regions: string = environment.regions,
): string[] {
  return createTokenList(regions).map((s) => s.toLowerCase());
}

export function createRegionLabels(
  regionLabels: string = environment.regionsLabels,
): string[] {
  return createTokenList(regionLabels);
}

export function getSheetIds(): { [key: string]: string } {
  const sheetIds: { [key: string]: string } = {};

  const regions: string[] = createRegionSlugs(environment.regions);
  const googleSheetsIds: string[] = createTokenList(
    environment.regionsSheetIds,
  );

  regions.forEach((_, index: number) => {
    sheetIds[regions[index]] = googleSheetsIds[index];
  });

  return sheetIds;
}

export function getRegionLabel(region: string = ''): string {
  const regions = createRegionSlugs();
  const regionsLabels = createRegionLabels();

  let label = regionsLabels[regions.indexOf(region)];

  if (!label) {
    label = region.toUpperCase();
  }

  return label;
}
