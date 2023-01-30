import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { LoggingService } from './logging.service';
import { PageMetaService } from './page-meta.service';
import { RegionDataService } from './region-data.service';

describe('PageMetaService', () => {
  let service: PageMetaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: LoggingService,
        },
        {
          provide: RegionDataService,
        },
        {
          provide: Title,
        },
      ],
    });
    service = TestBed.inject(PageMetaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
