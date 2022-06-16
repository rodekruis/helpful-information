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
}

export enum PageDataFallback {
  referralBackButtonLabel = 'Back',
  referralMainScreenButtonLabel = 'Main screen',
  labelLastUpdated = 'Last updated:',
}
