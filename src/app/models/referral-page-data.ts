export class ReferralPageData {
  referralPageLogo?: string;
  referralPageTitle?: string;
  referralPageGreeting?: string;
  referralPageInstructions?: string;
  referralBackButtonLabel?: string;
  referralMainScreenButtonLabel?: string;
  referralPhoneNumber?: string;
  referralWhatsAppLink?: string;
  referralTelegramLink?: string;
  referralLastUpdatedTime?: string;
  labelLastUpdated?: string;
  labelHighlightsButton?: string;
  labelHighlightsPageTitle?: string;
  labelHighlightsItemsZero?: string;
  labelHighlightsItemsCount?: string;
  labelSearchPageTitle?: string;
  labelSearchAction?: string;
  labelSearchResultsCount?: string;
}

export enum PageDataFallback {
  referralBackButtonLabel = 'Back',
  referralMainScreenButtonLabel = 'Main screen',
  labelLastUpdated = 'Last updated:',
  labelHighlightsButton = '!',
  labelHighlightsPageTitle = 'Highlights',
  labelHighlightsItemsZero = 'No highlighted items.',
  labelHighlightsItemsCount = 'Highlighted items:',
  labelSearchPageTitle = "Search Q&A's",
  labelSearchAction = 'Search',
  labelSearchResultsCount = 'Found results:',
}
