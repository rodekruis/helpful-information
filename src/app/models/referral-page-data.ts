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
  labelHighlightsPageTitle?: string;
  labelHighlightsItemsZero?: string;
  labelHighlightsItemsCount?: string;
}

export enum PageDataFallback {
  referralBackButtonLabel = 'Back',
  referralMainScreenButtonLabel = 'Main screen',
  labelLastUpdated = 'Last updated:',
  labelHighlightsPageTitle = 'Highlights',
  labelHighlightsItemsZero = 'No highlighted items.',
  labelHighlightsItemsCount = 'Highlighted items:',
}
