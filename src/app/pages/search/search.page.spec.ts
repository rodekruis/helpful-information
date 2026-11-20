import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import {
  mockQASet1,
  mockQASet2with1SubQuestion,
} from 'src/app/mocks/q-a-set.mock';
import type { QASet } from 'src/app/models/qa-set.model';
import { ConfigService } from 'src/app/services/config.service';
import { LoggingService } from 'src/app/services/logging.service';
import { OffersService } from 'src/app/services/offers.service';
import { RegionDataService } from 'src/app/services/region-data.service';
import { SearchService } from 'src/app/services/search.service';
import { ngxMarkdownModuleFactory } from 'src/app/shared/ngx-markdown.factory';
import { environment } from 'src/environments/environment';

import SearchPageComponent from './search.page';

describe('SearchPageComponent', () => {
  let component: SearchPageComponent;
  let fixture: ComponentFixture<SearchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('SearchPageComponent API rendering', () => {
  let component: SearchPageComponent;
  let fixture: ComponentFixture<SearchPageComponent>;
  const findQA = vi.fn();
  const originalSearchApi = environment.searchApi;

  beforeEach(async () => {
    environment.searchApi = 'https://search.example.org';
    findQA.mockReset();
    await TestBed.configureTestingModule({
      imports: [ngxMarkdownModuleFactory()],
      providers: [
        provideRouter([]),
        {
          provide: ConfigService,
          useValue: {
            getRegionByRegionSlug: () => ({ sheetId: 'sheet', label: 'Test' }),
          },
        },
        { provide: RegionDataService, useValue: { data: {} } },
        { provide: OffersService, useValue: { findQA } },
        { provide: LoggingService },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(SearchPageComponent);
    component = fixture.componentInstance;
    component.useSearchApi = true;
    component.region = 'test';
    component.regionData = { labelSearchPageTitle: 'Search' };
    component.searchQuery = 'Question';
    fixture.detectChanges();
  });

  afterEach(() => {
    environment.searchApi = originalSearchApi;
    vi.restoreAllMocks();
  });

  it('renders delayed API results in response order', async () => {
    let resolveFirst: (value: QASet) => void;
    const first = new Promise<QASet>((resolve) => {
      resolveFirst = resolve;
    });
    findQA
      .mockReturnValueOnce(first)
      .mockResolvedValueOnce(mockQASet2with1SubQuestion);
    vi.spyOn(window, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({ results: [mockQASet1, mockQASet2with1SubQuestion] }),
        {
          status: 200,
        },
      ),
    );

    const search = component.performSearch('Question');
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.loading-text')).not.toBeNull();

    resolveFirst(mockQASet1);
    await search;
    await fixture.whenStable();

    expect(
      fixture.nativeElement.querySelector(
        '[data-testid="search-results-label"]',
      ).textContent,
    ).toContain('2');
    const questions = fixture.nativeElement.querySelectorAll(
      'app-q-a-set > details > summary',
    );
    expect(
      Array.from(questions, (item: HTMLElement) => item.textContent.trim()),
    ).toEqual([mockQASet1.question, mockQASet2with1SubQuestion.question]);
  });

  it('clears previous results when the API returns no results', async () => {
    component.searchResults = [mockQASet1];
    vi.spyOn(window, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ results: [] }), { status: 200 }),
    );

    await component.performSearch('Question');
    await fixture.whenStable();

    expect(
      fixture.nativeElement.querySelector(
        '[data-testid="search-results-label"]',
      ).textContent,
    ).toContain('0');
    expect(fixture.nativeElement.querySelector('app-q-a-set')).toBeNull();
  });

  it('renders local results when the API request fails', async () => {
    TestBed.inject(SearchService).setSource([mockQASet1]);
    vi.spyOn(window, 'fetch').mockRejectedValue(new Error('Network failed'));
    const errorLog = vi.spyOn(console, 'error').mockImplementation(() => {});

    await component.performSearch('Question');
    await fixture.whenStable();

    expect(errorLog).toHaveBeenCalled();
    expect(
      fixture.nativeElement.querySelector(
        '[data-testid="search-results-label"]',
      ).textContent,
    ).toContain('1');
    expect(
      fixture.nativeElement.querySelector('app-q-a-set').textContent,
    ).toContain(mockQASet1.question);
  });
});
