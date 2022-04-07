import { TestBed } from '@angular/core/testing';
import { LoggingService } from './logging.service';
import { ReferralPageDataService } from './referral-page-data.service';
import { SpreadsheetService } from './spreadsheet.service';

describe('ReferralPageDataService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SpreadsheetService,
        },
        {
          provide: LoggingService,
        },
      ],
    }),
  );

  it('should be created', () => {
    const service: ReferralPageDataService = TestBed.inject(
      ReferralPageDataService,
    );
    expect(service).toBeTruthy();
  });
});
