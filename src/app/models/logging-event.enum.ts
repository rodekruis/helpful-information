export enum LoggingEventCategory {
  ai = 'AI',
  sw = 'SW',
  error = 'error',
}

export enum LoggingEvent {
  error = 'error',
  exception = 'exception',
  BackFromRegion = 'back-from-region',
  BackFromCategory = 'back-from-category',
  BackFromOffer = 'back-from-offer',
  BackFromSubCategory = 'back-from-sub-category',
  CategoryClick = 'category-click',
  FooterContactClick = 'footer-contact-click',
  FooterWhatsAppClick = 'footer-whatsapp-click',
  MainScreenClick = 'main-screen-button-click',
  OfferClick = 'offer-click',
  SubCategoryClick = 'sub-category-click',
  SwUpdateAvailable = 'sw-update-available',
  SwUpdateActivated = 'sw-update-activated',
}
