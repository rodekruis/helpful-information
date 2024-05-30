// All properties sorted alphabetically.
export type RegionData = {
  contactPhoneNumber?: string;
  contactTelegramLink?: string;
  contactWhatsAppLink?: string;
  feedbackAnswerNegative?: string;
  feedbackAnswerPositive?: string;
  feedbackQuestion?: string;
  feedbackResultNegative?: string;
  feedbackResultPostive?: string;
  feedbackShareCta?: string;
  feedbackShareUrl?: string;
  feedbackThanks?: string;
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
  pageFooter?: string;
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
  contactTel = 'contact.tel',
  contactTelegram = 'contact.telegram',
  contactWhatsApp = 'contact.whatsapp',
  feedbackAnswerNegative = 'feedback.answer.negative',
  feedbackAnswerPositive = 'feedback.answer.positive',
  feedbackQuestion = 'feedback.question',
  feedbackResultNegative = 'feedback.result.negative',
  feedbackResultPostive = 'feedback.result.positive',
  feedbackShareCta = 'feedback.share-cta',
  feedbackShareUrl = 'contact.feedback-url',
  feedbackThanks = 'feedback.thanks',
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
  mainFooter = 'main.footer',
  name = 'name',
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
  feedbackAnswerNegative = 'No',
  feedbackAnswerPositive = 'Yes',
  feedbackQuestion = 'Was this helpful?',
  feedbackResultNegative = 'We are sorry you did not find this information helpful.',
  feedbackResultPostive = 'We are happy you found this information helpful.',
  feedbackShareCta = 'Share feedback',
  feedbackThanks = 'Thank you for sharing your opinion',
  labelHighlightsButton = '!',
  labelHighlightsItemsCount = 'Highlighted items:',
  labelHighlightsItemsZero = 'No highlighted items.',
  labelHighlightsPageTitle = 'Highlights',
  labelLastUpdated = 'Last updated:',
  labelMainScreenButton = 'Helpful Information',
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
