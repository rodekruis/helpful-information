// All properties sorted alphabetically.
export type RegionData = {
  contactFeedbackUrl?: string;
  contactPhoneNumber?: string;
  contactTelegramLink?: string;
  contactWhatsAppLink?: string;
  labelBackButton?: string;
  labelFeedbackCta?: string;
  labelHighlightsButton?: string;
  labelHighlightsItemsCount?: string;
  labelHighlightsItemsZero?: string;
  labelHighlightsPageTitle?: string;
  labelLastUpdated?: string;
  labelMainScreenButton?: string;
  labelOfferAddress?: string;
  labelOfferEmail?: string;
  labelOfferNeedToKnow?: string;
  labelOfferOpenWeek?: string;
  labelOfferOpenWeekend?: string;
  labelOfferPhone?: string;
  labelOfferWebsite?: string;
  labelSearchAction?: string;
  labelSearchPageTitle?: string;
  labelSearchResultsCount?: string;
  lastUpdatedTime?: string;
  localeAlternatives?: {
    key: string;
    label: string;
    url?: string;
  }[];
  localeAlternativesExplanation?: string;
  localeDirection?: string;
  localeLanguage?: string;
  pageGreeting?: string;
  pageInstructions?: string;
  pageLogo?: string;
  pageNotification?: string;
  pageTitle?: string;
};

// These labels should be used anywhere in the sheets' column-header, prefixed with a `#`
// All properties sorted alphabetically.
export enum RegionCol {
  example = 'EXAMPLE',
  key = 'KEY',
  value = 'VALUE',
}

// These labels should be used anywhere in the main sheets' "#KEY"-column, prefixed with a `#`
// For example: "Contact: Phone-number (only digits, include coutry-code)   #contact.tel"
// All properties sorted alphabetically.
export enum RegionDataKey {
  contactFeedbackUrl = 'contact.feedback-url',
  contactTel = 'contact.tel',
  contactTelegram = 'contact.telegram',
  contactWhatsApp = 'contact.whatsapp',
  highlightsCta = 'highlights.cta',
  highlightsItems = 'highlights.items',
  highlightsItemsZero = 'highlights.items.0',
  highlightsTitle = 'highlights.title',
  labelFeedbackCta = 'label.feedback.cta',
  labelLastUpdated = 'label.last-updated',
  localeAlternatives = 'locale.alternatives',
  localeAlternativesExplanation = 'locale.alternatives.explanation',
  localeDirection = 'locale.dir',
  localeLanguage = 'locale.language',
  logo = 'logo',
  mainHeading = 'main.heading',
  mainIntro = 'main.intro',
  mainNotification = 'main.notification',
  name = 'name',
  navBack = 'nav.back',
  navMain = 'nav.main',
  offerAddress = 'offer.address',
  offerEmail = 'offer.email',
  offerNeedToKnow = 'offer.need-to-know',
  offerOpenWeek = 'offer.open.week',
  offerOpenWeekend = 'offer.open.weekend',
  offerPhone = 'offer.phone',
  offerWebsite = 'offer.website',
  searchCta = 'search.cta',
  searchItems = 'search.items',
  searchItemsZero = 'search.items.0',
  searchTitle = 'search.title',
  timestampLastUpdated = 'timestamp.last-updated',
}

// All properties sorted alphabetically.
export enum RegionDataFallback {
  labelBackButton = 'Back',
  labelFeedbackCta = 'Make a suggestion',
  labelHighlightsButton = '!',
  labelHighlightsItemsCount = 'Highlighted items:',
  labelHighlightsItemsZero = 'No highlighted items.',
  labelHighlightsPageTitle = 'Highlights',
  labelLastUpdated = 'Last updated:',
  labelMainScreenButton = 'Main screen',
  labelOfferAddress = 'Address',
  labelOfferEmail = 'E-mail',
  labelOfferNeedToKnow = 'What do you need to know?',
  labelOfferOpenWeek = 'Opening Hours - Weekdays',
  labelOfferOpenWeekend = 'Opening Hours - Weekends',
  labelOfferPhone = 'Phone-number(s)',
  labelOfferWebsite = 'Website(s)',
  labelSearchAction = 'Search',
  labelSearchPageTitle = "Search Q&A's",
  labelSearchResultsCount = 'Found results:',
}
