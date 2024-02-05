export function createTokenList(value: string): string[] {
  return value
    .trim()
    .split(/\s*,\s*/)
    .map((s) => s.trim());
}

export function createRegionSlugs(regions: string): string[] {
  return createTokenList(regions).map((s) => s.toLowerCase());
}

export function createRegionLabels(regionLabels: string): string[] {
  return createTokenList(regionLabels);
}
