import { Injectable } from '@angular/core';
import { ReferralPageData } from 'src/app/models/referral-page-data';
import { environment } from 'src/environments/environment';
import { SpreadsheetService } from './spreadsheet.service';

@Injectable({
  providedIn: 'root',
})
export class ReferralPageDataService {
  private validForTime = environment.apiDataValidFor * 1000;

  private cacheRegion: string;
  private cacheTimestamp: number;
  public data: ReferralPageData;

  constructor(private spreadsheetService: SpreadsheetService) {}

  private isSameRegion(region: string): boolean {
    return this.cacheRegion === region;
  }

  private isCacheValid(): boolean {
    return Date.now() - this.cacheTimestamp < this.validForTime;
  }

  private resetCache(region: string) {
    this.cacheRegion = region;
    this.cacheTimestamp = Date.now();
    this.data = null;
  }

  public async getReferralPageData(region: string): Promise<ReferralPageData> {
    if (!this.data || !this.isSameRegion(region) || !this.isCacheValid()) {
      this.resetCache(region);
      this.data = await this.spreadsheetService.getReferralPageData(region);
    }
    return this.data;
  }
}
