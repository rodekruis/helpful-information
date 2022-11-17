import { Injectable } from '@angular/core';
import { Category } from 'src/app/models/category.model';
import { Offer } from 'src/app/models/offer.model';
import { SubCategory } from 'src/app/models/sub-category.model';
import { QASet } from '../models/qa-set.model';
import { SpreadsheetService } from './spreadsheet.service';

const enum CacheName {
  categories,
  subCategories,
  offers,
  qaSets,
}

@Injectable({
  providedIn: 'root',
})
export class OffersService {
  private cache: {
    [name in CacheName]: {
      region: string;
      data: any[];
    } | null;
  } = {
    [CacheName.categories]: null,
    [CacheName.subCategories]: null,
    [CacheName.offers]: null,
    [CacheName.qaSets]: null,
  };

  constructor(private spreadsheetService: SpreadsheetService) {}

  private needsCaching(name: CacheName, region: string): boolean {
    return !this.cache || !this.cache[name] || !this.isSameRegion(name, region);
  }

  private isSameRegion(name: CacheName, region: string): boolean {
    return this.cache[name].region === region;
  }

  private resetCache(name: CacheName, region: string) {
    this.cache[name] = {
      region: region,
      data: null,
    };
  }

  public async getCategories(region: string): Promise<Category[]> {
    if (this.needsCaching(CacheName.categories, region)) {
      this.resetCache(CacheName.categories, region);
      this.cache[CacheName.categories].data =
        await this.spreadsheetService.getCategories(region);
    }
    return this.cache[CacheName.categories].data;
  }

  public async getSubCategories(region: string): Promise<SubCategory[]> {
    if (this.needsCaching(CacheName.subCategories, region)) {
      this.resetCache(CacheName.subCategories, region);
      this.cache[CacheName.subCategories].data =
        await this.spreadsheetService.getSubCategories(region);
    }
    return this.cache[CacheName.subCategories].data;
  }

  public async getOffers(region: string): Promise<Offer[]> {
    if (this.needsCaching(CacheName.offers, region)) {
      this.resetCache(CacheName.offers, region);
      this.cache[CacheName.offers].data =
        await this.spreadsheetService.getOffers(region);
    }
    return this.cache[CacheName.offers].data;
  }

  public async getQAs(region: string): Promise<QASet[]> {
    if (this.needsCaching(CacheName.qaSets, region)) {
      this.resetCache(CacheName.qaSets, region);
      this.cache[CacheName.qaSets].data = await this.spreadsheetService.getQAs(
        region,
      );
    }
    return this.cache[CacheName.qaSets].data;
  }
}
