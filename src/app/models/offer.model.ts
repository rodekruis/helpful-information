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
  subCategoryName?: string;
  categoryID: number;
  categoryName?: string;
  findAVaccinationCenter?: string;
  redCrossHelpDesk?: string;
  whatToExpect?: string;
  furtherInformation?: string;
  travelAbroad?: string;
  healthDeclarationDownload?: string;
  faqs?: string;
}

export enum OfferCol {
  id = 'ID',
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
  for = 'FOR',
  needToKnow = 'NEEDTOKNOW',
  rights = 'RIGHTS',
  name = 'NAME',
  vaccinationUrl = 'VACCINATIONURL',
  helpDesk = 'HELPDESK',
  toExpect = 'TOEXPECT',
  moreInfo = 'MOREINFO',
  travelAbroad = 'TRAVELABROAD',
  healthDownload = 'HEALTHDOWNLOAD',
  faqUrl = 'FAQURL',
}
