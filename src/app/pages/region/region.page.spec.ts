import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LoggingService } from 'src/app/services/logging.service';
import { OffersService } from 'src/app/services/offers.service';
import { ngxMarkdownModuleFactory } from 'src/main';

import RegionPageComponent from './region.page';

describe('RegionPageComponent', () => {
  let component: RegionPageComponent;
  let fixture: ComponentFixture<RegionPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ngxMarkdownModuleFactory()],
      providers: [
        provideRouter([]),
        {
          provide: OffersService,
        },
        {
          provide: LoggingService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
