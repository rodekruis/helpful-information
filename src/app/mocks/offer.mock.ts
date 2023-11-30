import type { Offer } from 'src/app/models/offer.model';

// All properties sorted alphabetically.
export default {
  categoryID: 1,
  offerAddress: 'Mock Offer Address',
  offerDescription: 'Mock Offer Description',
  offerDoYouNeedToKnow: 'Mock Offer What do you need to know',
  offerEmails: ['Mock Offer Email'],
  offerIcon:
    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">i</text></svg>',
  offerID: 1,
  offerLinks: ['Mock Offer Link'],
  offerName: 'Mock Offer Name',
  offerNumbers: ['Mock Offer Number'],
  offerOpeningHoursWeekdays: 'Mock Offer Opening Hours Weekdays',
  offerOpeningHoursWeekends: 'Mock Offer Opening Hours Weekends',
  offerVisible: true,
  subCategoryID: 1,
} as Offer;
