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
  pageTitle?: string;
}

export enum PageDataFallback {
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
