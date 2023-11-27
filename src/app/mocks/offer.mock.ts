import { Offer } from 'src/app/models/offer.model';

export default {
  offerID: 1,
  offerIcon:
    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">i</text></svg>',
  offerName: 'Mock Offer Name',
  offerDescription: 'Mock Offer Description',
  offerLinks: ['Mock Offer Link'],
  offerNumbers: ['Mock Offer Number'],
  offerEmails: ['Mock Offer Email'],
  offerAddress: 'Mock Offer Address',
  offerOpeningHoursWeekdays: 'Mock Offer Opening Hours Weekdays',
  offerOpeningHoursWeekends: 'Mock Offer Opening Hours Weekends',
  offerDoYouNeedToKnow: 'Mock Offer What do you need to know',
  offerVisible: true,
  subCategoryID: 1,
  categoryID: 1,
} as Offer;
