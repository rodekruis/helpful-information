import { Injectable } from '@angular/core';
import { Category } from 'src/app/models/category.model';
import { Offer } from 'src/app/models/offer.model';
import { SubCategory } from 'src/app/models/sub-category.model';
import { QASet } from '../models/qa-set.model';
import { SpreadsheetService } from './spreadsheet.service';

@Injectable({
  providedIn: 'root',
})
export class OffersService {
  constructor(private spreadsheetService: SpreadsheetService) {}

  getCategories(region: string): Promise<Category[]> {
    return this.spreadsheetService.getCategories(region);
  }

  getSubCategories(region: string): Promise<SubCategory[]> {
    return this.spreadsheetService.getSubCategories(region);
  }

  getOffers(region: string): Promise<Offer[]> {
    return this.spreadsheetService.getOffers(region);
  }

  getQAs(region: string): Promise<QASet[]> {
    return this.spreadsheetService.getQAs(region);
  }
}
