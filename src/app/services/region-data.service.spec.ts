import { TestBed } from '@angular/core/testing';
import { LoggingService } from './logging.service';
import { RegionDataService } from './region-data.service';
import { SpreadsheetService } from './spreadsheet.service';

describe('RegionDataService', () => {
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
    const service: RegionDataService = TestBed.inject(RegionDataService);

    expect(service).toBeTruthy();
  });
});
