import { Injectable } from '@angular/core';
import type { Region, RegionSet } from 'src/app/models/config.model';
import {
  createRegionSlugs,
  getRegionLabel,
  getSheetIds,
} from 'src/app/shared/util.environment';
import { slugify } from 'src/app/shared/utils';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  public config: {
    regions: RegionSet[];
  } = {
    regions: [],
  };

  constructor() {
    this.config.regions = this.createRegionSets();
  }

  private createRegionSets(): RegionSet[] {
    let regionSets: RegionSet[] = [];

    if (environment.regionConfig) {
      try {
        regionSets = JSON.parse(environment.regionConfig);
      } catch(e) {
        console.error('Failed to parse regionConfig:', e);
      }

      regionSets = regionSets.map((regionSet: RegionSet) => {
        if (!regionSet.slug && regionSet.name) {
          regionSet.slug = slugify(regionSet.name);
        }
        return regionSet;
      });

      return regionSets;
    }

    // Fall back to a single set with all regions specified in the environment
    const regions: string[] = createRegionSlugs(environment.regions);
    const sheetIds = getSheetIds();

    const allRegions = regions.map((region: string) => {
      return {
        slug: region,
        label: getRegionLabel(region),
        sheetId: sheetIds[region],
      };
    });

    return [{ regions: allRegions }];
  }

  public getRegionSlugs(): string[] {
    return this.config.regions.reduce((acc, set) => {
      return acc.concat(set.regions.map((r) => r.slug));
    }, [] as string[]);
  }

  private getRegionSetByRegionSlug(slug: string): RegionSet | undefined {
    return this.config.regions.find((set) =>
      set.regions.find((r) => r.slug === slug),
    );
  }

  public getRegionByRegionSlug(region: string): Region | undefined {
    const regionSet = this.getRegionSetByRegionSlug(region);

    if (regionSet) {
      return regionSet.regions.find((r) => r.slug === region);
    }

    return undefined;
  }
}
