import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LoggingService } from 'src/app/services/logging.service';
import { OffersService } from 'src/app/services/offers.service';
import { RegionDataService } from 'src/app/services/region-data.service';

import SearchPageComponent from './search.page';

describe('SearchPageComponent', () => {
  let component: SearchPageComponent;
  let fixture: ComponentFixture<SearchPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: RegionDataService,
        },
        {
          provide: OffersService,
        },
        {
          provide: LoggingService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
