import { Injectable } from '@angular/core';
import { Category } from 'src/app/models/category.model';
import { Offer } from 'src/app/models/offer.model';
import { ReferralPageData } from 'src/app/models/referral-page-data';
import { SeverityLevel } from 'src/app/models/severity-level.enum';
import { SubCategory } from 'src/app/models/sub-category.model';
import { LoggingService } from 'src/app/services/logging.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SpreadsheetService {
  private spreadsheetURL = environment.google_sheets_api_url;
  private spreadsheetId = {};
  private apiKey = environment.google_sheets_api_key;
  private categorySheetName = 'Categories';
  private subCategorySheetName = 'Sub-Categories';
  private offerSheetName = 'Offers';
  private referralPageSheetName = 'Referral Page';

  constructor(private loggingService: LoggingService) {
    this.loadSheetIds();
  }

  static readCellValue(row, key: number): string {
    return key < row.length ? row[key].trim() : '';
  }

  loadSheetIds(): void {
    const regions: string[] = environment.regions.trim().split(/\s*,\s*/);
    const spreadsheetIds: string[] = environment.google_sheets_sheet_ids
      .trim()
      .split(/\s*,\s*/);

    regions.forEach((_, index) => {
      this.spreadsheetId[regions[index]] = spreadsheetIds[index];
    });
  }

  convertCategoryRowToCategoryObject(categoryRow): Category {
    return {
      categoryID: Number(SpreadsheetService.readCellValue(categoryRow, 0)),
      categoryName: SpreadsheetService.readCellValue(categoryRow, 1),
      categoryIcon: SpreadsheetService.readCellValue(categoryRow, 2),
      categoryDescription: SpreadsheetService.readCellValue(categoryRow, 3),
      categoryVisible:
        SpreadsheetService.readCellValue(categoryRow, 4) === 'Show',
    };
  }

  getCategories(region): Promise<Category[]> {
    return fetch(
      `${this.spreadsheetURL}/${this.spreadsheetId[region]}` +
        `/values/${this.categorySheetName}` +
        `?key=${this.apiKey}&alt=json&prettyPrint=false`,
    )
      .then((response) => response.json())
      .then((response) => {
        return response.values
          .map(this.convertCategoryRowToCategoryObject)
          .filter((category: Category): boolean => category.categoryVisible);
      })
      .catch((error) => {
        if (this.loggingService) {
          this.loggingService.logException(error, SeverityLevel.Critical);
        }
        return [];
      });
  }

  convertSubCategoryRowToSubCategoryObject(subCategoryRow): SubCategory {
    return {
      subCategoryID: Number(
        SpreadsheetService.readCellValue(subCategoryRow, 0),
      ),
      subCategoryName: SpreadsheetService.readCellValue(subCategoryRow, 1),
      subCategoryIcon: SpreadsheetService.readCellValue(subCategoryRow, 2),
      subCategoryDescription: SpreadsheetService.readCellValue(
        subCategoryRow,
        3,
      ),
      subCategoryVisible:
        SpreadsheetService.readCellValue(subCategoryRow, 4) === 'Show',
      categoryID: Number(SpreadsheetService.readCellValue(subCategoryRow, 5)),
    };
  }

  getSubCategories(region): Promise<SubCategory[]> {
    return fetch(
      `${this.spreadsheetURL}/${this.spreadsheetId[region]}` +
        `/values/${this.subCategorySheetName}` +
        `?key=${this.apiKey}&alt=json&prettyPrint=false`,
    )
      .then((response) => response.json())
      .then((response) => {
        return response.values
          .map(this.convertSubCategoryRowToSubCategoryObject)
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

  convertOfferRowToOfferObject(offerRow): Offer {
    return {
      offerID: Number(SpreadsheetService.readCellValue(offerRow, 3)),
      offerIcon: SpreadsheetService.readCellValue(offerRow, 5),
      offerDescription: SpreadsheetService.readCellValue(offerRow, 6),
      offerLinks: SpreadsheetService.readCellValue(offerRow, 9)
        .split('\n')
        .filter((_) => _),
      offerNumbers: SpreadsheetService.readCellValue(offerRow, 7)
        .split('\n')
        .filter((_) => _),
      offerEmails: SpreadsheetService.readCellValue(offerRow, 8)
        .split('\n')
        .filter((_) => _),
      offerAddress: SpreadsheetService.readCellValue(offerRow, 10),
      offerOpeningHoursWeekdays: SpreadsheetService.readCellValue(offerRow, 11),
      offerOpeningHoursWeekends: SpreadsheetService.readCellValue(offerRow, 12),
      offerForWhom: SpreadsheetService.readCellValue(offerRow, 13),
      offerDoYouNeedToKnow: SpreadsheetService.readCellValue(offerRow, 14),
      offerBasicRight: SpreadsheetService.readCellValue(offerRow, 15),
      offerVisible: SpreadsheetService.readCellValue(offerRow, 4) === 'Show',
      subCategoryID: Number(SpreadsheetService.readCellValue(offerRow, 1)),
      categoryID: Number(SpreadsheetService.readCellValue(offerRow, 2)),
      findAVaccinationCenter: SpreadsheetService.readCellValue(offerRow, 17),
      redCrossHelpDesk: SpreadsheetService.readCellValue(offerRow, 18),
      whatToExpect: SpreadsheetService.readCellValue(offerRow, 19),
      furtherInformation: SpreadsheetService.readCellValue(offerRow, 20),
      travelAbroad: SpreadsheetService.readCellValue(offerRow, 21),
      healthDeclarationDownload: SpreadsheetService.readCellValue(offerRow, 22),
      faqs: SpreadsheetService.readCellValue(offerRow, 23),
    };
  }

  getOffers(region): Promise<Offer[]> {
    return fetch(
      `${this.spreadsheetURL}/${this.spreadsheetId[region]}` +
        `/values/${this.offerSheetName}` +
        `?key=${this.apiKey}&alt=json&prettyPrint=false`,
    )
      .then((response) => response.json())
      .then((response) => {
        return response.values
          .map(this.convertOfferRowToOfferObject)
          .filter((offer: Offer): boolean => offer.offerVisible);
      })
      .catch((error) => {
        if (this.loggingService) {
          this.loggingService.logException(error, SeverityLevel.Critical);
        }
        return [];
      });
  }

  convertReferralPageDataRowToReferralPageDataObject(
    referralPageDataRows,
  ): ReferralPageData {
    return {
      referralPageLogo: SpreadsheetService.readCellValue(
        referralPageDataRows[1],
        1,
      ),
      referralPageTitle: SpreadsheetService.readCellValue(
        referralPageDataRows[2],
        1,
      ),
      referralPageGreeting: SpreadsheetService.readCellValue(
        referralPageDataRows[3],
        1,
      ),
      referralPageInstructions: SpreadsheetService.readCellValue(
        referralPageDataRows[4],
        1,
      ),
      referralBackButtonLabel: SpreadsheetService.readCellValue(
        referralPageDataRows[5],
        1,
      ),
      referralMainScreenButtonLabel: SpreadsheetService.readCellValue(
        referralPageDataRows[6],
        1,
      ),
      referralPhoneNumber: SpreadsheetService.readCellValue(
        referralPageDataRows[7],
        1,
      ),
      referralWhatsAppLink: SpreadsheetService.readCellValue(
        referralPageDataRows[8],
        1,
      ),
      referralLastUpdatedTime: SpreadsheetService.readCellValue(
        referralPageDataRows[9],
        1,
      ),
      referralOfferButtonLabel: SpreadsheetService.readCellValue(
        referralPageDataRows[10],
        1,
      ),
      referralSubCategoryButtonLabel: SpreadsheetService.readCellValue(
        referralPageDataRows[11],
        1,
      ),
    };
  }

  getReferralPageData(region): Promise<ReferralPageData> {
    return fetch(
      `${this.spreadsheetURL}/${this.spreadsheetId[region]}` +
        `/values/${this.referralPageSheetName}` +
        `?key=${this.apiKey}&alt=json&prettyPrint=false`,
    )
      .then((response) => response.json())
      .then((response) => {
        return this.convertReferralPageDataRowToReferralPageDataObject(
          response.values,
        );
      })
      .catch((error) => {
        if (this.loggingService) {
          this.loggingService.logException(error, SeverityLevel.Critical);
        }
        return new ReferralPageData();
      });
  }
}
