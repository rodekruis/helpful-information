export class Offer {
  offerID: number;
  slug?: string;
  offerIcon: string;
  offerName?: string;
  offerDescription: string;
  offerLinks: string[];
  offerNumbers: string[];
  offerEmails: string[];
  offerAddress?: string;
  offerOpeningHoursWeekdays?: string;
  offerOpeningHoursWeekends?: string;
  offerDoYouNeedToKnow?: string;
  offerVisible: boolean;
  subCategoryID: number;
  subCategorySlug?: string;
  subCategoryName?: string;
  categoryID: number;
  categorySlug?: string;
  categoryName?: string;
  moreInfo?: string;
}

// These labels should be used anywhere in the sheets' column-header, prefixed with a `#`
// For example: "Phone-number(s) (1 digits-only number per line) #PHONENUMBERS"
export enum OfferCol {
  id = 'ID',
  slug = 'SLUG',
  subCategory = 'SUBCATEGORY',
  category = 'CATEGORY',
  visible = 'VISIBLE',
  icon = 'ICON',
  description = 'DESCRIPTION',
  phoneNumbers = 'PHONENUMBERS',
  emails = 'EMAILS',
  webUrls = 'WEBURLS',
  address = 'ADDRESS',
  openWeek = 'OPENWEEK',
  openWeekend = 'OPENWEEKEND',
  needToKnow = 'NEEDTOKNOW',
  name = 'NAME',
  moreInfo = 'MOREINFO',
}
