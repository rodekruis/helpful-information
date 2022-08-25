import { Injectable } from '@angular/core';
import { ReferralPageData } from 'src/app/models/referral-page-data';
import { SpreadsheetService } from './spreadsheet.service';

@Injectable({
  providedIn: 'root',
})
export class ReferralPageDataService {
  public data: ReferralPageData;

  constructor(private spreadsheetService: SpreadsheetService) {}

  public async getReferralPageData(region: string): Promise<ReferralPageData> {
    this.data = await this.spreadsheetService.getReferralPageData(region);
    return this.data;
  }
}
