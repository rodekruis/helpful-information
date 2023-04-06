export class RegionData {
  contactPhoneNumber?: string;
  contactTelegramLink?: string;
  contactWhatsAppLink?: string;
  labelBackButton?: string;
  labelHighlightsButton?: string;
  labelHighlightsItemsCount?: string;
  labelHighlightsItemsZero?: string;
  labelHighlightsPageTitle?: string;
  labelLastUpdated?: string;
  labelMainScreenButton?: string;
  labelSearchAction?: string;
  labelSearchPageTitle?: string;
  labelSearchResultsCount?: string;
  lastUpdatedTime?: string;
  pageGreeting?: string;
  pageInstructions?: string;
  pageLogo?: string;
  pageNotification?: string;
  pageTitle?: string;
}

// These labels should be used anywhere in the sheets' column-header, prefixed with a `#`
export enum RegionCol {
  key = 'KEY',
  value = 'VALUE',
  example = 'EXAMPLE',
}

// These labels should be used anywhere in the main sheets' "#KEY"-column, prefixed with a `#`
// For example: "Contact: Phone-number (only digits, include coutry-code)   #contact.tel"
export enum RegionDataKey {
  contactTel = 'contact.tel',
  contactTelegram = 'contact.telegram',
  contactWhatsApp = 'contact.whatsapp',
  highlightsCta = 'highlights.cta',
  highlightsItems = 'highlights.items',
  highlightsItemsZero = 'highlights.items.0',
  highlightsTitle = 'highlights.title',
  labelLastUpdated = 'label.last-updated',
  logo = 'logo',
  mainHeading = 'main.heading',
  mainIntro = 'main.intro',
  mainNotification = 'main.notification',
  name = 'name',
  navBack = 'nav.back',
  navMain = 'nav.main',
  searchCta = 'search.cta',
  searchItems = 'search.items',
  searchItemsZero = 'search.items.0',
  searchTitle = 'search.title',
  timestampLastUpdated = 'timestamp.last-updated',
}

export enum RegionDataFallback {
  labelBackButton = 'Back',
  labelHighlightsButton = '!',
  labelHighlightsItemsCount = 'Highlighted items:',
  labelHighlightsItemsZero = 'No highlighted items.',
  labelHighlightsPageTitle = 'Highlights',
  labelLastUpdated = 'Last updated:',
  labelMainScreenButton = 'Main screen',
  labelSearchAction = 'Search',
  labelSearchPageTitle = "Search Q&A's",
  labelSearchResultsCount = 'Found results:',
}
