export class Offer {
  offerID: number;
  offerName: string;
  offerIcon: string;
  offerDescription: string;
  offerLinks: string[];
  offerNumbers: string[];
  offerEmails: string[];
  offerAddress?: string;
  offerOpeningHoursWeekdays?: string;
  offerOpeningHoursWeekends?: string;
  offerForWhom?: string;
  offerWhatWillYouNeed?: string;
  offerBasicRight?: string;
  offerVisible: boolean;
  subCategoryID: number;
  categoryID: number;
}
