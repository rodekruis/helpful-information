import { Injectable } from '@angular/core';
import { Category } from 'src/app/models/category.model';
import { Offer } from 'src/app/models/offer.model';
import { SubCategory } from 'src/app/models/sub-category.model';
import { environment } from 'src/environments/environment';
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
  private validForTime = environment.apiDataValidFor * 1000;

  private cache: {
    [name in CacheName]: {
      region: string;
      timestamp: number;
      data: any[];
    } | null;
  } = {
    [CacheName.categories]: null,
    [CacheName.subCategories]: null,
    [CacheName.offers]: null,
    [CacheName.qaSets]: null,
  };

  constructor(private spreadsheetService: SpreadsheetService) {}

  private needsCache(name: CacheName, region: string): boolean {
    return (
      !this.cache ||
      !this.cache[name] ||
      !this.isSameRegion(name, region) ||
      !this.isCacheValid(name)
    );
  }

  private isSameRegion(name: CacheName, region: string): boolean {
    return this.cache[name].region === region;
  }

  private isCacheValid(name: CacheName): boolean {
    return Date.now() - this.cache[name].timestamp < this.validForTime;
  }

  private resetCache(name: CacheName, region: string) {
    this.cache[name] = {
      region: region,
      timestamp: Date.now(),
      data: null,
    };
  }

  public async getCategories(region: string): Promise<Category[]> {
    if (this.needsCache(CacheName.categories, region)) {
      this.resetCache(CacheName.categories, region);
      this.cache[CacheName.categories].data =
        await this.spreadsheetService.getCategories(region);
    }
    return this.cache[CacheName.categories].data;
  }

  public async getSubCategories(region: string): Promise<SubCategory[]> {
    if (this.needsCache(CacheName.subCategories, region)) {
      this.resetCache(CacheName.subCategories, region);
      this.cache[CacheName.subCategories].data =
        await this.spreadsheetService.getSubCategories(region);
    }
    return this.cache[CacheName.subCategories].data;
  }

  public async getOffers(region: string): Promise<Offer[]> {
    if (this.needsCache(CacheName.offers, region)) {
      this.resetCache(CacheName.offers, region);
      this.cache[CacheName.offers].data =
        await this.spreadsheetService.getOffers(region);
    }
    return this.cache[CacheName.offers].data;
  }

  public async getQAs(region: string): Promise<QASet[]> {
    if (this.needsCache(CacheName.qaSets, region)) {
      this.resetCache(CacheName.qaSets, region);
      this.cache[CacheName.qaSets].data = await this.spreadsheetService.getQAs(
        region,
      );
    }
    return this.cache[CacheName.qaSets].data;
  }
}
