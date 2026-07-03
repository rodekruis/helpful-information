import { createTokenList } from 'scripts/lib/createTokenList.mjs';
import { environment } from 'src/environments/environment';

export function createRegionSlugs(regions: string): string[] {
  return createTokenList(regions).map((s) => s.toLowerCase());
}

function createRegionLabels(regionLabels: string): string[] {
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
  const regions = createRegionSlugs(environment.regions);
  const regionsLabels = createRegionLabels(environment.regionsLabels);

  let label = regionsLabels[regions.indexOf(region)];

  if (!label) {
    label = region.toUpperCase();
  }

  return label;
}
