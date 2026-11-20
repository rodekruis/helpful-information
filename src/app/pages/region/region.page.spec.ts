import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import type { RegionData } from 'src/app/models/region-data';
import { LoggingService } from 'src/app/services/logging.service';
import { OffersService } from 'src/app/services/offers.service';
import { RegionDataService } from 'src/app/services/region-data.service';
import { ngxMarkdownModuleFactory } from 'src/app/shared/ngx-markdown.factory';

import RegionPageComponent from './region.page';

describe('RegionPageComponent', () => {
  let component: RegionPageComponent;
  let fixture: ComponentFixture<RegionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('RegionPageComponent asynchronous rendering', () => {
  it('renders region data after a delayed response', async () => {
    let resolveData: (value: RegionData) => void;
    const regionData = new Promise<RegionData>((resolve) => {
      resolveData = resolve;
    });

    await TestBed.configureTestingModule({
      imports: [ngxMarkdownModuleFactory()],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { params: of({ region: 'test' }) },
        },
        {
          provide: RegionDataService,
          useValue: { getData: () => regionData },
        },
        {
          provide: OffersService,
          useValue: {
            getCategories: vi.fn().mockResolvedValue([]),
            getAllSubCategories: vi.fn().mockResolvedValue([]),
            getQAs: vi.fn().mockResolvedValue([]),
            getHighlights: vi.fn().mockResolvedValue([]),
          },
        },
        { provide: LoggingService },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(RegionPageComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h2').textContent).toBe('');

    resolveData({ pageGreeting: 'Delayed greeting' });
    await regionData;
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('h2').textContent).toContain(
      'Delayed greeting',
    );
  });
});
