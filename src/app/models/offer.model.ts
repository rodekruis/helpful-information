export class Offer {
  offerID: number;
  offerIcon: string;
  offerName?: string;
  offerDescription: string;
  offerLinks: string[];
  offerNumbers: string[];
  offerEmails: string[];
  offerAddress?: string;
  offerOpeningHoursWeekdays?: string;
  offerOpeningHoursWeekends?: string;
  offerForWhom?: string;
  offerDoYouNeedToKnow?: string;
  offerWhatWillYouNeed?: string;
  offerBasicRight?: string;
  offerVisible: boolean;
  subCategoryID: number;
  categoryID: number;
  findAVaccinationCenter?: string;
  redCrossHelpDesk?: string;
  whatToExpect?: string;
  furtherInformation?: string;
  travelAbroad?: string;
  healthDeclarationDownload?: string;
  faqs?: string;
}
