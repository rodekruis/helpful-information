import { TestBed } from '@angular/core/testing';
import { LoggingService } from './logging.service';
import { OffersService } from './offers.service';
import { SpreadsheetService } from './spreadsheet.service';

describe('OffersService', () => {
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
    const service: OffersService = TestBed.inject(OffersService);
    expect(service).toBeTruthy();
  });
});
