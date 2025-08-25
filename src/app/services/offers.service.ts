import { Injectable } from '@angular/core';
import type { Category } from 'src/app/models/category.model';
import {
  LoggingEvent,
  LoggingEventCategory,
} from 'src/app/models/logging-event.enum';
import type { Offer } from 'src/app/models/offer.model';
import type { QASet } from 'src/app/models/qa-set.model';
import { SlugPrefix } from 'src/app/models/slug-prefix.enum';
import type { SubCategory } from 'src/app/models/sub-category.model';
import { createSlug, slugify } from 'src/app/shared/utils';

import { LoggingService } from './logging.service';
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

  constructor(
    private spreadsheetService: SpreadsheetService,
    private loggingService: LoggingService,
  ) {}

  private needsCaching(name: CacheName, region: string): boolean {
    return (
      !this.cache ||
      !this.cache[name] ||
      !this.isSameRegion(name, region) ||
      !this.cache[name].data
    );
  }

  private isSameRegion(name: CacheName, region: string): boolean {
    return this.cache[name].region === region;
  }

  private setCache(name: CacheName, region: string, data: any) {
    this.cache[name] = {
      region: region,
      data: data,
    };
  }

  public async getCategories(region: string): Promise<Category[]> {
    if (this.needsCaching(CacheName.categories, region)) {
      this.setCache(
        CacheName.categories,
        region,
        await this.spreadsheetService.getCategories(region),
      );
    }
    return this.cache[CacheName.categories].data;
  }

  public async findCategory(query: {
    region: string;
    categoryID?: number;
    categorySlug?: string;
  }): Promise<Category | undefined> {
    const categories = await this.getCategories(query.region);

    const foundCategory = categories.find((category) => {
      const categoryMatches =
        category.slug === query.categorySlug ||
        category.categoryID === query.categoryID;

      return categoryMatches;
    });

    if (!foundCategory) {
      this.loggingService.logEvent(
        LoggingEventCategory.error,
        LoggingEvent.NotFoundCategory,
        query,
      );
    }
    return foundCategory;
  }

  public async getAllSubCategories(region: string): Promise<SubCategory[]> {
    if (this.needsCaching(CacheName.subCategories, region)) {
      let subCategories =
        await this.spreadsheetService.getSubCategories(region);
      subCategories = subCategories.map((subCategory: SubCategory) => {
        return SpreadsheetService.addParentCategoryDetails(
          subCategory,
          this.cache[CacheName.categories].data,
        );
      });

      this.setCache(CacheName.subCategories, region, subCategories);
    }
    return this.cache[CacheName.subCategories].data;
  }

  public async findSubCategory(query: {
    region: string;
    categoryID?: number;
    categorySlug?: string;
    subCategoryID?: number;
    subCategorySlug?: string;
  }): Promise<SubCategory | undefined> {
    const subCategories = await this.getAllSubCategories(query.region);

    const foundSubCategory = subCategories.find((subCategory) => {
      const subCategoryMatches =
        subCategory.slug === query.subCategorySlug ||
        subCategory.subCategoryID === query.subCategoryID;
      const categoryMatches =
        subCategory.categorySlug === query.categorySlug ||
        subCategory.categoryID === query.categoryID;

      return subCategoryMatches && categoryMatches;
    });

    if (!foundSubCategory) {
      this.loggingService.logEvent(
        LoggingEventCategory.error,
        LoggingEvent.NotFoundSubCategory,
        query,
      );
    }
    return foundSubCategory;
  }

  public getOnlyChildSubCategory(
    category: Category,
    subCategories: SubCategory[],
  ): SubCategory | null {
    if (!subCategories || !subCategories.length) {
      return null;
    }
    subCategories = subCategories.filter((subCategory: SubCategory) => {
      return subCategory.categoryID === category.categoryID;
    });
    return subCategories.length === 1 ? subCategories[0] : null;
  }

  public async getOffers(region: string): Promise<Offer[]> {
    if (this.needsCaching(CacheName.offers, region)) {
      const categories = await this.getCategories(region);
      const subCategories = await this.getAllSubCategories(region);

      let offers = await this.spreadsheetService.getOffers(region);
      offers = offers
        .filter((offer: Offer): boolean => offer.offerVisible)
        .map((offer: Offer) => {
          offer = SpreadsheetService.addParentCategoryDetails(
            offer,
            categories,
          );
          offer = SpreadsheetService.addParentSubCategoryDetails(
            offer,
            subCategories,
          );
          return offer;
        })
        .map((offer: Offer) => {
          offer.chapterSlug = createSlug(
            null,
            slugify(offer.chapterName),
            SlugPrefix.chapter,
          );
          return offer;
        });

      this.setCache(CacheName.offers, region, offers);
    }
    return this.cache[CacheName.offers].data;
  }

  public getOffersGroupedByChapter(offers: Offer[]): Offer[][] {
    let offerSets = new Map<string, Offer[]>();
    offers.forEach((offer) => {
      if (!offerSets.has(offer.chapterName)) {
        offerSets.set(offer.chapterName, []);
      }
      offerSets.get(offer.chapterName).push(offer);
    });
    offerSets = new Map(
      // Sort by Map-key (i.e: by ChapterName)
      [...offerSets].sort(([a], [b]) => String(a).localeCompare(b)),
    );

    return Array.from(offerSets.values());
  }

  public async findOffer(query: {
    region: string;
    categoryID?: number;
    categorySlug?: string;
    subCategoryID?: number;
    subCategorySlug?: string;
    offerID?: number;
    offerSlug?: string;
  }): Promise<Offer | undefined> {
    const offers = await this.getOffers(query.region);

    const foundOffer = offers.find((offer: Offer) => {
      const offerMatches =
        offer.slug === query.offerSlug || offer.offerID === query.offerID;
      const subCategoryMatches =
        offer.subCategorySlug === query.subCategorySlug ||
        offer.subCategoryID === query.subCategoryID;
      const categoryMatches =
        offer.categorySlug === query.categorySlug ||
        offer.categoryID === query.categoryID;

      return offerMatches && subCategoryMatches && categoryMatches;
    });

    if (!foundOffer) {
      this.loggingService.logEvent(
        LoggingEventCategory.error,
        LoggingEvent.NotFoundOffer,
        query,
      );
    }
    return foundOffer;
  }

  public async getQAs(region: string): Promise<QASet[]> {
    if (this.needsCaching(CacheName.qaSets, region)) {
      const categories = await this.getCategories(region);
      const subCategories = await this.getAllSubCategories(region);

      let qaSets = await this.spreadsheetService.getQAs(region);
      qaSets = qaSets.map((qaSet: QASet) => {
        qaSet = SpreadsheetService.addParentCategoryDetails(qaSet, categories);
        qaSet = SpreadsheetService.addParentSubCategoryDetails(
          qaSet,
          subCategories,
        );
        return qaSet;
      });

      this.setCache(CacheName.qaSets, region, qaSets);
    }
    return this.cache[CacheName.qaSets].data;
  }

  public async findQA(query: {
    region: string;
    categoryID?: number;
    subCategoryID?: number;
    question?: string;
    slug?: string | null;
  }): Promise<QASet | undefined> {
    const qaSets = await this.getQAs(query.region);

    const foundQA = qaSets.find((qaSet: QASet) => {
      const slugMatches = !!query.slug && qaSet.slug === query.slug;
      const questionMatches =
        !!query.question && qaSet.question.trim() === query.question.trim();
      const subCategoryMatches = qaSet.subCategoryID === query.subCategoryID;
      const categoryMatches = qaSet.categoryID === query.categoryID;

      return (
        (slugMatches || questionMatches) &&
        subCategoryMatches &&
        categoryMatches
      );
    });

    if (!foundQA) {
      this.loggingService.logEvent(
        LoggingEventCategory.error,
        LoggingEvent.NotFoundQA,
        query,
      );
    }
    return foundQA;
  }

  public async getHighlights(region: string): Promise<QASet[]> {
    // Load 'requirements'...
    const qaSets = await this.getQAs(region);

    // Create a deep copy of the Q&A set:
    const items = qaSets.map((item) => ({ ...item }));
    return items
      .filter((item) => item.isHighlight)
      .sort((a, b) => {
        if (a.dateUpdated && !b.dateUpdated) {
          return -1;
        }
        if (!a.dateUpdated && b.dateUpdated) {
          return 1;
        }
        if (!a.dateUpdated && !b.dateUpdated) {
          return 0;
        }
        return b.dateUpdated.getTime() - a.dateUpdated.getTime();
      })
      .map((item) => {
        if (!item.children) {
          return item;
        }
        const highlightedChildren = item.children.filter(
          (child) => child.isHighlight,
        );
        // If only a few children are highlighted include those
        // If NO children are highlighted include all
        if (highlightedChildren.length) {
          item.children = highlightedChildren;
        }
        return item;
      });
  }
}
