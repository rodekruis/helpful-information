import { Injectable } from '@angular/core';
import { ReferralPageData } from 'src/app/models/referral-page-data';
import { SpreadsheetService } from './spreadsheet.service';

@Injectable({
  providedIn: 'root',
})
export class ReferralPageDataService {
  private cacheRegion: string;
  public data: ReferralPageData;

  constructor(private spreadsheetService: SpreadsheetService) {}

  private isSameRegion(region: string): boolean {
    return this.cacheRegion === region;
  }

  private resetCache(region: string) {
    this.cacheRegion = region;
    this.data = null;
  }

  public async getReferralPageData(region: string): Promise<ReferralPageData> {
    if (!this.data || !this.isSameRegion(region)) {
      this.resetCache(region);
      this.data = await this.spreadsheetService.getReferralPageData(region);
    }
    return this.data;
  }
}
