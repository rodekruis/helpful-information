// All properties sorted alphabetically.
export type Offer = {
  categoryID: number;
  categoryName?: string;
  categorySlug?: string;
  chapterName?: string;
  chapterSlug?: string;
  moreInfo?: string;
  offerAddress?: string;
  offerDescription: string;
  offerDoYouNeedToKnow?: string;
  offerEmails: string[];
  offerIcon: string;
  offerID: number;
  offerLinks: string[];
  offerName?: string;
  offerNumbers: string[];
  offerOpeningHoursWeekdays?: string;
  offerOpeningHoursWeekends?: string;
  offerVisible: boolean;
  slug?: string;
  subCategoryID: number;
  subCategoryName?: string;
  subCategorySlug?: string;
};

// These labels should be used anywhere in the sheets' column-header, prefixed with a `#`
// For example: "Phone-number(s) (1 digits-only number per line) #PHONENUMBERS"
// All properties sorted alphabetically.
export enum OfferCol {
  address = 'ADDRESS',
  category = 'CATEGORY',
  chapter = 'CHAPTER',
  description = 'DESCRIPTION',
  emails = 'EMAILS',
  icon = 'ICON',
  id = 'ID',
  moreInfo = 'MOREINFO',
  name = 'NAME',
  needToKnow = 'NEEDTOKNOW',
  openWeek = 'OPENWEEK',
  openWeekend = 'OPENWEEKEND',
  phoneNumbers = 'PHONENUMBERS',
  slug = 'SLUG',
  subCategory = 'SUBCATEGORY',
  visible = 'VISIBLE',
  webUrls = 'WEBURLS',
}
