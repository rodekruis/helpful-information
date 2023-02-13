import { Injectable } from '@angular/core';
import { Category, CategoryCol } from 'src/app/models/category.model';
import { Offer, OfferCol } from 'src/app/models/offer.model';
import { RegionData, RegionDataFallback } from 'src/app/models/region-data';
import { SeverityLevel } from 'src/app/models/severity-level.enum';
import { SubCategory, SubCategoryCol } from 'src/app/models/sub-category.model';
import { LoggingService } from 'src/app/services/logging.service';
import { environment } from 'src/environments/environment';
import {
  LoggingEvent,
  LoggingEventCategory,
} from '../models/logging-event.enum';
import { QACol, QASet } from '../models/qa-set.model';
import { SlugPrefix } from '../models/slug-prefix.enum';
import { createSlug, getDateFromString, getFullUrl } from '../shared/utils';

enum SheetName {
  page = 'Referral Page',
  categories = 'Categories',
  subCategories = 'Sub-Categories',
  offers = 'Offers',
  QandAs = 'Q&As',
}

type ColumnMap = Map<string, number>;

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

  private getColumnIndexFromTag(row: string[], tagName: string) {
    const tag = `#${tagName.toUpperCase()}`;
    return row.findIndex((headerLabel: string) => {
      return headerLabel.toUpperCase().indexOf(tag) !== -1;
    });
  }

  private createColumnMap(columns: string[], headerRow: string[]): ColumnMap {
    let colMap: ColumnMap = new Map();
    columns.forEach((colName: string) => {
      colMap.set(colName, this.getColumnIndexFromTag(headerRow, colName));
    });
    return colMap;
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
    colMap: ColumnMap,
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
        const headerRow = response.values[0];
        const categoriesColumnMap = this.createColumnMap(
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
    colMap: ColumnMap,
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
        const headerRow = response.values[0];
        const subCategoryColumnMap = this.createColumnMap(
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

  private convertOfferRowToOfferObject(
    row: string[],
    colMap: ColumnMap,
  ): Offer {
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
      offerForWhom: SpreadsheetService.readCellValue(
        row,
        colMap.get(OfferCol.for),
      ),
      offerDoYouNeedToKnow: SpreadsheetService.readCellValue(
        row,
        colMap.get(OfferCol.needToKnow),
      ),
      offerBasicRight: SpreadsheetService.readCellValue(
        row,
        colMap.get(OfferCol.rights),
      ),
      findAVaccinationCenter: getFullUrl(
        SpreadsheetService.readCellValue(
          row,
          colMap.get(OfferCol.vaccinationUrl),
        ),
      ),
      redCrossHelpDesk: SpreadsheetService.readCellValue(
        row,
        colMap.get(OfferCol.helpDesk),
      ),
      whatToExpect: SpreadsheetService.readCellValue(
        row,
        colMap.get(OfferCol.toExpect),
      ),
      furtherInformation: SpreadsheetService.readCellValue(
        row,
        colMap.get(OfferCol.moreInfo),
      ),
      travelAbroad: SpreadsheetService.readCellValue(
        row,
        colMap.get(OfferCol.travelAbroad),
      ),
      healthDeclarationDownload: getFullUrl(
        SpreadsheetService.readCellValue(
          row,
          colMap.get(OfferCol.healthDownload),
        ),
      ),
      faqs: getFullUrl(
        SpreadsheetService.readCellValue(row, colMap.get(OfferCol.faqUrl)),
      ),
    };
  }

  public getOffers(region: string): Promise<Offer[]> {
    return fetch(this.getSheetUrl(region, SheetName.offers))
      .then((response) => response.json())
      .then((response) => {
        const headerRow = response.values[0];
        const offerColumnMap = this.createColumnMap(
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

  private convertReferralPageRowToRegionData(
    referralPageDataRows: string[][],
  ): RegionData {
    return {
      pageLogo: SpreadsheetService.readCellValue(referralPageDataRows[1], 1),
      pageTitle: SpreadsheetService.readCellValue(referralPageDataRows[2], 1),
      pageGreeting: SpreadsheetService.readCellValue(
        referralPageDataRows[3],
        1,
      ),
      pageInstructions: SpreadsheetService.readCellValue(
        referralPageDataRows[4],
        1,
      ),
      labelBackButton:
        SpreadsheetService.readCellValue(referralPageDataRows[5], 1) ||
        RegionDataFallback.labelBackButton,
      labelMainScreenButton:
        SpreadsheetService.readCellValue(referralPageDataRows[6], 1) ||
        RegionDataFallback.labelMainScreenButton,
      contactPhoneNumber: SpreadsheetService.readCellValue(
        referralPageDataRows[7],
        1,
      ),
      contactWhatsAppLink: SpreadsheetService.readCellValue(
        referralPageDataRows[8],
        1,
      ),
      contactTelegramLink: SpreadsheetService.readCellValue(
        referralPageDataRows[12],
        1,
      ),
      lastUpdatedTime: SpreadsheetService.readCellValue(
        referralPageDataRows[9],
        1,
      ),
      labelLastUpdated:
        SpreadsheetService.readCellValue(referralPageDataRows[10], 1) ||
        RegionDataFallback.labelLastUpdated,
      labelHighlightsButton:
        SpreadsheetService.readCellValue(referralPageDataRows[17], 1) ||
        RegionDataFallback.labelHighlightsButton,
      labelHighlightsPageTitle:
        SpreadsheetService.readCellValue(referralPageDataRows[14], 1) ||
        RegionDataFallback.labelHighlightsPageTitle,
      labelHighlightsItemsZero:
        SpreadsheetService.readCellValue(referralPageDataRows[15], 1) ||
        RegionDataFallback.labelHighlightsItemsZero,
      labelHighlightsItemsCount:
        SpreadsheetService.readCellValue(referralPageDataRows[16], 1) ||
        RegionDataFallback.labelHighlightsItemsCount,
      labelSearchPageTitle:
        SpreadsheetService.readCellValue(referralPageDataRows[19], 1) ||
        RegionDataFallback.labelSearchPageTitle,
      labelSearchAction:
        SpreadsheetService.readCellValue(referralPageDataRows[20], 1) ||
        RegionDataFallback.labelSearchAction,
      labelSearchResultsCount:
        SpreadsheetService.readCellValue(referralPageDataRows[21], 1) ||
        RegionDataFallback.labelSearchResultsCount,
    };
  }

  public async getReferralPageData(region: string): Promise<RegionData> {
    return fetch(this.getSheetUrl(region, SheetName.page))
      .then((response) => response.json())
      .then((response) => {
        return this.convertReferralPageRowToRegionData(response.values);
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
    colMap: ColumnMap,
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
          return [];
        }
        const headerRow = response.values[0];
        const qaColumnMap = this.createColumnMap(
          Object.values(QACol),
          headerRow,
        );

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
