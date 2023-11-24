import { Injectable } from '@angular/core';
import { Category, CategoryCol } from 'src/app/models/category.model';
import {
  LoggingEvent,
  LoggingEventCategory,
} from 'src/app/models/logging-event.enum';
import { Offer, OfferCol } from 'src/app/models/offer.model';
import { QACol, QASet } from 'src/app/models/qa-set.model';
import {
  RegionCol,
  RegionData,
  RegionDataFallback,
  RegionDataKey,
} from 'src/app/models/region-data';
import { SeverityLevel } from 'src/app/models/severity-level.enum';
import { SlugPrefix } from 'src/app/models/slug-prefix.enum';
import { SubCategory, SubCategoryCol } from 'src/app/models/sub-category.model';
import { LoggingService } from 'src/app/services/logging.service';
import {
  createSlug,
  getDateFromString,
  getFullUrl,
} from 'src/app/shared/utils';
import { environment } from 'src/environments/environment';

enum SheetName {
  config = 'Referral Page',
  categories = 'Categories',
  subCategories = 'Sub-Categories',
  offers = 'Offers',
  QandAs = 'Q&As',
}

type KeyMap = Map<string, number>;

@Injectable({
  providedIn: 'root',
})
export class SpreadsheetService {
  static visibleKey = 'Show';
  static booleanTrueKey = 'Yes';

  private sheetIds: { [key: string]: string } = {};

  constructor(private loggingService?: LoggingService) {
    this.loadSheetIds();
  }

  static readCellValue(row: string[], key: number): string {
    if (!!row && !!row[key] && key < row.length) {
      return row[key].trim();
    }
    return '';
  }

  static isVisible(value: string): boolean {
    return value === this.visibleKey;
  }

  static isBoolean(value: string): boolean {
    return value === this.booleanTrueKey;
  }

  private loadSheetIds(): void {
    const regions: string[] = environment.regions.trim().split(/\s*,\s*/);
    const googleSheetsIds: string[] = environment.regionsSheetIds
      .trim()
      .split(/\s*,\s*/);

    regions.forEach((_, index: number) => {
      this.sheetIds[regions[index]] = googleSheetsIds[index];
    });
  }

  private getSheetUrl(region: string, sheetName: SheetName): string {
    return `${environment.google_sheets_api_url}/${this.sheetIds[region]}/values/${sheetName}?key=${environment.google_sheets_api_key}&alt=json&prettyPrint=false`;
  }

  private getIndexOfTag(collection: string[], tagName: string) {
    const tag = `#${tagName.toUpperCase()}`;
    return collection.findIndex((value: string) => {
      return value.toUpperCase().indexOf(tag) !== -1;
    });
  }

  private createKeyMap(keys: string[], collection: string[]): KeyMap {
    const keyMap: KeyMap = new Map();
    keys.forEach((keyName: string) => {
      keyMap.set(keyName, this.getIndexOfTag(collection, keyName));
    });
    return keyMap;
  }

  private createKeysCollection(rows: string[][], colMap: KeyMap): string[] {
    return rows.map((row) => {
      return SpreadsheetService.readCellValue(row, colMap.get(RegionCol.key));
    });
  }

  static getCategory(
    id: Category['categoryID'],
    collection: Category[],
  ): Category | null {
    if (!collection) return null;
    const category = collection.find((item) => item.categoryID === id);
    return category ? category : null;
  }

  static getSubCategory(
    id: SubCategory['subCategoryID'],
    collection: SubCategory[],
  ): SubCategory | null {
    if (!collection) return null;
    const subCategory = collection.find((item) => item.subCategoryID === id);
    return subCategory ? subCategory : null;
  }

  static addParentSubCategoryDetails(
    entity: Offer,
    subCategories: SubCategory[],
  ): Offer;
  static addParentSubCategoryDetails(
    entity: QASet,
    subCategories: SubCategory[],
  ): QASet;
  static addParentSubCategoryDetails(
    entity: Offer | QASet,
    subCategories: SubCategory[],
  ): Offer | QASet {
    const subCategory = SpreadsheetService.getSubCategory(
      entity.subCategoryID,
      subCategories,
    );
    entity.subCategoryName =
      subCategory && subCategory.subCategoryName
        ? subCategory.subCategoryName
        : '';
    entity.subCategorySlug =
      subCategory && subCategory.slug ? subCategory.slug : '';

    return entity;
  }

  static addParentCategoryDetails(
    entity: SubCategory,
    categories: Category[],
  ): SubCategory;
  static addParentCategoryDetails(entity: Offer, categories: Category[]): Offer;
  static addParentCategoryDetails(entity: QASet, categories: Category[]): QASet;
  static addParentCategoryDetails(
    entity: SubCategory | Offer | QASet,
    categories: Category[],
  ): SubCategory | Offer | QASet {
    const category = SpreadsheetService.getCategory(
      entity.categoryID,
      categories,
    );
    entity.categoryName =
      category && category.categoryName ? category.categoryName : '';
    entity.categorySlug = category && category.slug ? category.slug : '';

    return entity;
  }

  private convertCategoryRowToCategoryObject(
    row: string[],
    colMap: KeyMap,
  ): Category {
    const id = Number(
      SpreadsheetService.readCellValue(row, colMap.get(CategoryCol.id)),
    );
    return {
      categoryID: id,
      slug: createSlug(
        SpreadsheetService.readCellValue(row, colMap.get(CategoryCol.slug)),
        id,
        SlugPrefix.category,
      ),
      categoryName: SpreadsheetService.readCellValue(
        row,
        colMap.get(CategoryCol.name),
      ),
      categoryIcon: SpreadsheetService.readCellValue(
        row,
        colMap.get(CategoryCol.icon),
      ),
      categoryDescription: SpreadsheetService.readCellValue(
        row,
        colMap.get(CategoryCol.description),
      ),
      categoryVisible: SpreadsheetService.isVisible(
        SpreadsheetService.readCellValue(row, colMap.get(CategoryCol.visible)),
      ),
    };
  }

  public getCategories(region: string): Promise<Category[]> {
    return fetch(this.getSheetUrl(region, SheetName.categories))
      .then((response) => response.json())
      .then((response) => {
        if (!response || !response.values || !response.values.length) {
          throw new Error(
            `Error: ${LoggingEvent.NotFoundSheetRows} - Sheet: ${SheetName.categories}`,
          );
        }
        const headerRow = response.values[0];
        const categoriesColumnMap = this.createKeyMap(
          Object.values(CategoryCol),
          headerRow,
        );

        return response.values
          .slice(1) // Remove header-row
          .map((row: any[]) =>
            this.convertCategoryRowToCategoryObject(row, categoriesColumnMap),
          )
          .filter((category: Category): boolean => category.categoryVisible);
      })
      .catch((error) => {
        if (this.loggingService) {
          this.loggingService.logException(error, SeverityLevel.Critical);
        }
        return [];
      });
  }

  private convertSubCategoryRowToSubCategoryObject(
    row: string[],
    colMap: KeyMap,
  ): SubCategory {
    const id = Number(
      SpreadsheetService.readCellValue(row, colMap.get(SubCategoryCol.id)),
    );
    return {
      subCategoryID: id,
      slug: createSlug(
        SpreadsheetService.readCellValue(row, colMap.get(SubCategoryCol.slug)),
        id,
        SlugPrefix.subCategory,
      ),
      subCategoryName: SpreadsheetService.readCellValue(
        row,
        colMap.get(SubCategoryCol.name),
      ),
      subCategoryIcon: SpreadsheetService.readCellValue(
        row,
        colMap.get(SubCategoryCol.icon),
      ),
      subCategoryDescription: SpreadsheetService.readCellValue(
        row,
        colMap.get(SubCategoryCol.description),
      ),
      subCategoryVisible: SpreadsheetService.isVisible(
        SpreadsheetService.readCellValue(
          row,
          colMap.get(SubCategoryCol.visible),
        ),
      ),
      categoryID: Number(
        SpreadsheetService.readCellValue(
          row,
          colMap.get(SubCategoryCol.category),
        ),
      ),
    };
  }

  public getSubCategories(region: string): Promise<SubCategory[]> {
    return fetch(this.getSheetUrl(region, SheetName.subCategories))
      .then((response) => response.json())
      .then((response) => {
        if (!response || !response.values || !response.values.length) {
          throw new Error(
            `Error: ${LoggingEvent.NotFoundSheetRows} - Sheet: ${SheetName.subCategories}`,
          );
        }
        const headerRow = response.values[0];
        const subCategoryColumnMap = this.createKeyMap(
          Object.values(SubCategoryCol),
          headerRow,
        );

        return response.values
          .slice(1) // Remove header-row
          .map((row: any[]) =>
            this.convertSubCategoryRowToSubCategoryObject(
              row,
              subCategoryColumnMap,
            ),
          )
          .filter(
            (subCategory: SubCategory): boolean =>
              subCategory.subCategoryVisible,
          );
      })
      .catch((error) => {
        if (this.loggingService) {
          this.loggingService.logException(error, SeverityLevel.Critical);
        }
        return [];
      });
  }

  private convertOfferRowToOfferObject(row: string[], colMap: KeyMap): Offer {
    const id = Number(
      SpreadsheetService.readCellValue(row, colMap.get(OfferCol.id)),
    );
    return {
      offerID: id,
      slug: createSlug(
        SpreadsheetService.readCellValue(row, colMap.get(OfferCol.slug)),
        id,
        SlugPrefix.offer,
      ),
      subCategoryID: Number(
        SpreadsheetService.readCellValue(row, colMap.get(OfferCol.subCategory)),
      ),
      categoryID: Number(
        SpreadsheetService.readCellValue(row, colMap.get(OfferCol.category)),
      ),
      offerVisible: SpreadsheetService.isVisible(
        SpreadsheetService.readCellValue(row, colMap.get(OfferCol.visible)),
      ),
      offerIcon: SpreadsheetService.readCellValue(
        row,
        colMap.get(OfferCol.icon),
      ),
      offerName: SpreadsheetService.readCellValue(
        row,
        colMap.get(OfferCol.name),
      ),
      offerDescription: SpreadsheetService.readCellValue(
        row,
        colMap.get(OfferCol.description),
      ),
      offerLinks: SpreadsheetService.readCellValue(
        row,
        colMap.get(OfferCol.webUrls),
      )
        .split('\n')
        .filter((_) => _)
        .map((url) => getFullUrl(url)),
      offerNumbers: SpreadsheetService.readCellValue(
        row,
        colMap.get(OfferCol.phoneNumbers),
      )
        .split('\n')
        .filter((_) => _),
      offerEmails: SpreadsheetService.readCellValue(
        row,
        colMap.get(OfferCol.emails),
      )
        .split('\n')
        .filter((_) => _),
      offerAddress: SpreadsheetService.readCellValue(
        row,
        colMap.get(OfferCol.address),
      ),
      offerOpeningHoursWeekdays: SpreadsheetService.readCellValue(
        row,
        colMap.get(OfferCol.openWeek),
      ),
      offerOpeningHoursWeekends: SpreadsheetService.readCellValue(
        row,
        colMap.get(OfferCol.openWeekend),
      ),
      offerDoYouNeedToKnow: SpreadsheetService.readCellValue(
        row,
        colMap.get(OfferCol.needToKnow),
      ),
      moreInfo: SpreadsheetService.readCellValue(
        row,
        colMap.get(OfferCol.moreInfo),
      ),
    };
  }

  public getOffers(region: string): Promise<Offer[]> {
    return fetch(this.getSheetUrl(region, SheetName.offers))
      .then((response) => response.json())
      .then((response) => {
        if (!response || !response.values || !response.values.length) {
          throw new Error(
            `Error: ${LoggingEvent.NotFoundSheetRows} - Sheet: ${SheetName.offers}`,
          );
        }
        const headerRow = response.values[0];
        const offerColumnMap = this.createKeyMap(
          Object.values(OfferCol),
          headerRow,
        );

        return response.values
          .slice(1) // Remove header-row
          .map((row: any[]) =>
            this.convertOfferRowToOfferObject(row, offerColumnMap),
          )
          .filter((offer: Offer): boolean => offer.offerVisible);
      })
      .catch((error) => {
        if (this.loggingService) {
          this.loggingService.logException(error, SeverityLevel.Critical);
        }
        return [];
      });
  }

  private convertConfigSheetToRegionData(
    sheetRows: string[][],
    valueCol: number,
    rowMap: KeyMap,
  ): RegionData {
    const sharedData = {
      rows: sheetRows,
      rowMap: rowMap,
      valueCol: valueCol,
    };

    return {
      localeDirection: this.getConfigValueOrFallback(
        sharedData,
        RegionDataKey.localeDirection,
        -1,
      ),
      localeLanguage: this.getConfigValueOrFallback(
        sharedData,
        RegionDataKey.localeLanguage,
        -1,
      ),
      pageLogo: this.getConfigValueOrFallback(
        sharedData,
        RegionDataKey.logo,
        1,
      ),
      pageTitle: this.getConfigValueOrFallback(
        sharedData,
        RegionDataKey.name,
        2,
      ),
      pageGreeting: this.getConfigValueOrFallback(
        sharedData,
        RegionDataKey.mainHeading,
        3,
      ),
      pageInstructions: this.getConfigValueOrFallback(
        sharedData,
        RegionDataKey.mainIntro,
        4,
      ),
      pageNotification: this.getConfigValueOrFallback(
        sharedData,
        RegionDataKey.mainNotification,
        11,
      ),
      labelBackButton: this.getConfigValueOrFallback(
        sharedData,
        RegionDataKey.navBack,
        5,
        RegionDataFallback.labelBackButton,
      ),
      labelMainScreenButton: this.getConfigValueOrFallback(
        sharedData,
        RegionDataKey.navMain,
        6,
        RegionDataFallback.labelMainScreenButton,
      ),
      contactPhoneNumber: this.getConfigValueOrFallback(
        sharedData,
        RegionDataKey.contactTel,
        7,
      ),
      contactWhatsAppLink: this.getConfigValueOrFallback(
        sharedData,
        RegionDataKey.contactWhatsApp,
        8,
      ),
      contactTelegramLink: this.getConfigValueOrFallback(
        sharedData,
        RegionDataKey.contactTelegram,
        12,
      ),
      lastUpdatedTime: this.getConfigValueOrFallback(
        sharedData,
        RegionDataKey.timestampLastUpdated,
        9,
      ),
      labelLastUpdated: this.getConfigValueOrFallback(
        sharedData,
        RegionDataKey.labelLastUpdated,
        10,
        RegionDataFallback.labelLastUpdated,
      ),
      labelOfferAddress: this.getConfigValueOrFallback(
        sharedData,
        RegionDataKey.offerAddress,
        -1,
        RegionDataFallback.labelOfferAddress,
      ),
      labelOfferEmail: this.getConfigValueOrFallback(
        sharedData,
        RegionDataKey.offerEmail,
        -1,
        RegionDataFallback.labelOfferEmail,
      ),
      labelOfferNeedToKnow: this.getConfigValueOrFallback(
        sharedData,
        RegionDataKey.offerNeedToKnow,
        -1,
        RegionDataFallback.labelOfferNeedToKnow,
      ),
      labelOfferOpenWeek: this.getConfigValueOrFallback(
        sharedData,
        RegionDataKey.offerOpenWeek,
        -1,
        RegionDataFallback.labelOfferOpenWeek,
      ),
      labelOfferOpenWeekend: this.getConfigValueOrFallback(
        sharedData,
        RegionDataKey.offerOpenWeekend,
        -1,
        RegionDataFallback.labelOfferOpenWeekend,
      ),
      labelOfferPhone: this.getConfigValueOrFallback(
        sharedData,
        RegionDataKey.offerPhone,
        -1,
        RegionDataFallback.labelOfferPhone,
      ),
      labelOfferWebsite: this.getConfigValueOrFallback(
        sharedData,
        RegionDataKey.offerWebsite,
        -1,
        RegionDataFallback.labelOfferWebsite,
      ),
      labelHighlightsButton: this.getConfigValueOrFallback(
        sharedData,
        RegionDataKey.highlightsCta,
        17,
        RegionDataFallback.labelHighlightsButton,
      ),
      labelHighlightsPageTitle: this.getConfigValueOrFallback(
        sharedData,
        RegionDataKey.highlightsTitle,
        14,
        RegionDataFallback.labelHighlightsPageTitle,
      ),
      labelHighlightsItemsZero: this.getConfigValueOrFallback(
        sharedData,
        RegionDataKey.highlightsItemsZero,
        15,
        RegionDataFallback.labelHighlightsItemsZero,
      ),
      labelHighlightsItemsCount: this.getConfigValueOrFallback(
        sharedData,
        RegionDataKey.highlightsItems,
        16,
        RegionDataFallback.labelHighlightsItemsCount,
      ),
      labelSearchPageTitle: this.getConfigValueOrFallback(
        sharedData,
        RegionDataKey.searchTitle,
        19,
        RegionDataFallback.labelSearchPageTitle,
      ),
      labelSearchAction: this.getConfigValueOrFallback(
        sharedData,
        RegionDataKey.searchCta,
        20,
        RegionDataFallback.labelSearchAction,
      ),
      labelSearchResultsCount: this.getConfigValueOrFallback(
        sharedData,
        RegionDataKey.searchItems,
        21,
        RegionDataFallback.labelSearchResultsCount,
      ),
    };
  }

  private getConfigValueOrFallback(
    baseData: {
      rows: string[][];
      rowMap: KeyMap;
      valueCol: number;
    },
    key: RegionDataKey,
    fallbackIndex: number = -1,
    fallbackValue?: RegionDataFallback,
  ): string {
    const value = SpreadsheetService.readCellValue(
      baseData.rows[
        this.getIndexOrFallback(baseData.rowMap.get(key), fallbackIndex)
      ],
      baseData.valueCol,
    );

    if (value === '' && !!fallbackValue) {
      return fallbackValue;
    }

    return value;
  }

  private getIndexOrFallback(index: number, fallback: number): number {
    return !!index && index !== -1 ? index : fallback;
  }

  public async getRegionConfigData(region: string): Promise<RegionData> {
    return fetch(this.getSheetUrl(region, SheetName.config))
      .then((response) => response.json())
      .then((response: { values: string[][] }) => {
        if (!response || !response.values || !response.values.length) {
          throw new Error(
            `Error: ${LoggingEvent.NotFoundSheetRows} - Sheet: ${SheetName.config}`,
          );
        }
        const regionRows = response.values;
        const headerRow = regionRows[0];
        const regionColumnMap = this.createKeyMap(
          Object.values(RegionCol),
          headerRow,
        );
        const valueCol = this.getIndexOrFallback(
          regionColumnMap.get(RegionCol.value),
          1,
        );

        const keysCol = this.createKeysCollection(regionRows, regionColumnMap);
        const regionRowMap = this.createKeyMap(
          Object.values(RegionDataKey),
          keysCol,
        );

        return this.convertConfigSheetToRegionData(
          regionRows,
          valueCol,
          regionRowMap,
        );
      })
      .catch((error) => {
        if (this.loggingService) {
          this.loggingService.logException(error, SeverityLevel.Critical);
        }
        return new RegionData();
      });
  }

  private convertQaRowToObject(
    row: string[],
    colMap: KeyMap,
    index: number,
  ): QASet {
    return {
      id: index,
      subCategoryID: Number(
        SpreadsheetService.readCellValue(row, colMap.get(QACol.subcategory)),
      ),
      categoryID: Number(
        SpreadsheetService.readCellValue(row, colMap.get(QACol.category)),
      ),
      isVisible: SpreadsheetService.isVisible(
        SpreadsheetService.readCellValue(row, colMap.get(QACol.visible)),
      ),
      isHighlight: SpreadsheetService.isBoolean(
        SpreadsheetService.readCellValue(row, colMap.get(QACol.highlight)),
      ),
      dateUpdated: getDateFromString(
        SpreadsheetService.readCellValue(row, colMap.get(QACol.updated)),
      ),
      slug: createSlug(
        SpreadsheetService.readCellValue(row, colMap.get(QACol.slug)),
        index,
        SlugPrefix.qaSet,
      ),
      parentSlug: String(
        SpreadsheetService.readCellValue(row, colMap.get(QACol.parent)),
      ),
      question: String(
        SpreadsheetService.readCellValue(row, colMap.get(QACol.question)),
      ),
      answer: String(
        SpreadsheetService.readCellValue(row, colMap.get(QACol.answer)),
      ),
      children: [],
    };
  }

  private addToParentQuestion(
    element: QASet,
    _index: number,
    all: QASet[],
  ): QASet | false {
    if (!element.parentSlug) {
      return element;
    }

    const parentRow = all.find((row) => row.slug === element.parentSlug);

    // When defined parentRow is missing, treat as a 'normal' question
    if (!parentRow) {
      if (this.loggingService) {
        this.loggingService.logEvent(
          LoggingEventCategory.error,
          LoggingEvent.NotFoundParentQuestion,
          {
            row: element.id,
            slug: element.slug,
            parentSlug: element.parentSlug,
          },
        );
      }
      return element;
    }

    // When pointing to itself, treat as a 'normal' question
    if (parentRow === element) {
      if (this.loggingService) {
        this.loggingService.logEvent(
          LoggingEventCategory.error,
          LoggingEvent.NotFoundParentQuestionIsSelf,
          {
            row: element.id,
            slug: element.slug,
            parentSlug: element.parentSlug,
          },
        );
      }
      return element;
    }

    if (!!parentRow.children && element.isVisible) {
      delete element.children;
      // Add this question to its parents' collection:
      parentRow.children.push(element);
    }

    // Remove self from total collection of Questions:
    return false;
  }

  public getQAs(region: string): Promise<QASet[]> {
    return fetch(this.getSheetUrl(region, SheetName.QandAs))
      .then((response) => response.json())
      .then((response) => {
        if (!response || !response.values || !response.values.length) {
          throw new Error(
            `Error: ${LoggingEvent.NotFoundSheetRows} - Sheet: ${SheetName.QandAs}`,
          );
        }
        const headerRow = response.values[0];
        const qaColumnMap = this.createKeyMap(Object.values(QACol), headerRow);

        return response.values
          .slice(1) // Remove header-row
          .map((row: string[], index: number) =>
            this.convertQaRowToObject(row, qaColumnMap, index),
          )
          .map((item: QASet, index: number, all: QASet[]) =>
            this.addToParentQuestion(item, index, all),
          )
          .filter(
            (row: QASet): boolean =>
              row.isVisible && !!row.question && !!row.answer,
          );
      })
      .catch((error) => {
        if (this.loggingService) {
          this.loggingService.logException(error, SeverityLevel.Critical);
        }
        return [];
      });
  }
}
