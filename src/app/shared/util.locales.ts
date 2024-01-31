import type { RegionData } from 'src/app/models/region-data';

export function createLocaleAlternatives(
  input: string,
): RegionData['localeAlternatives'] {
  if (!input) {
    return [];
  }

  const localeSets = input.split(',');

  return localeSets.flatMap((set) => {
    const localeSet = set.split(':');

    if (localeSet.length !== 2) {
      return [];
    }

    const key = localeSet[0] ? localeSet[0].trim() : '';
    const label = localeSet[1] ? localeSet[1].trim() : '';

    if (!key || !label) {
      return [];
    }

    return [
      {
        key,
        label,
      },
    ];
  });
}
