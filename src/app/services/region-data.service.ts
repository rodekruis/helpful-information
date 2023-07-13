import { Injectable } from '@angular/core';
import { RegionData } from 'src/app/models/region-data';

import { SpreadsheetService } from './spreadsheet.service';

@Injectable({
  providedIn: 'root',
})
export class RegionDataService {
  private cacheRegion: string;
  public data: RegionData;

  constructor(private spreadsheetService: SpreadsheetService) {}

  private isSameRegion(region: string): boolean {
    return this.cacheRegion === region;
  }

  private resetCache(region: string) {
    this.cacheRegion = region;
    this.data = null;
  }

  public async getData(region: string): Promise<RegionData> {
    if (!this.data || !this.isSameRegion(region)) {
      this.resetCache(region);
      this.data = await this.spreadsheetService.getRegionConfigData(region);
    }
    return this.data;
  }
}
