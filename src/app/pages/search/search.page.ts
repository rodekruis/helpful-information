import { NgIf } from '@angular/common';
import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import type { Params } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { ParentLinkComponent } from 'src/app/components/parent-link/parent-link.component';
import { QASetListComponent } from 'src/app/components/q-a-set-list/q-a-set-list.component';
import { SearchInputComponent } from 'src/app/components/search-input/search-input.component';
import type { QASet } from 'src/app/models/qa-set.model';
import type { RegionData } from 'src/app/models/region-data';
import { ConfigService } from 'src/app/services/config.service';
import { OffersService } from 'src/app/services/offers.service';
import { PageMetaService } from 'src/app/services/page-meta.service';
import { RegionDataService } from 'src/app/services/region-data.service';
import { SearchService } from 'src/app/services/search.service';
import { environment } from 'src/environments/environment';
import { AppPath } from 'src/routes';

const SEARCH_API_RESULT_LIMIT = 8;
type SearchApiResponse = {
  results?: SearchApiResultItem[];
};

// Rename the `subcategoryID` to `subCategoryID`
type SearchApiResultItem = SearchResult & {
  subcategoryID?: number;
  subCategoryID?: number;
  children?: Omit<SearchApiResultItem[], 'children'>;
};

type SearchResult = QASet & {
  score?: number;
};

@Component({
  selector: 'app-search-page',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.css'],
  imports: [
    MarkdownModule,
    NgIf,
    ParentLinkComponent,
    QASetListComponent,
    SearchInputComponent,
  ],
})
export default class SearchPageComponent implements OnInit {
  public useSearchApi = environment.useQandASearch && !!environment.searchApi;

  public region: string;
  public regionData: RegionData;
  public qaSets: QASet[];

  public searchQuery: string;
  public searchResults: QASet[];
  public loadingSearch: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private regionDataService: RegionDataService,
    private offersService: OffersService,
    private searchService: SearchService,
    private pageMeta: PageMetaService,
    private configService: ConfigService,
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(async (params: Params) => {
      this.handleRouteParams(params);
    });
  }

  private async handleRouteParams(params: Params) {
    this.region = params.region;

    if (!this.region && this.route.snapshot.parent) {
      this.region = this.route.snapshot.parent.params.region;
    }

    if (!this.region) return;

    this.regionData = await this.regionDataService.getData(this.region);

    this.pageMeta.setDirection(this.regionData.localeDirection);
    this.pageMeta.setLanguage(this.regionData.localeLanguage);

    this.pageMeta.setTitle({
      pageName: this.regionData?.labelSearchPageTitle,
      region: this.region,
    });
    this.pageMeta.setCanonicalUrl({
      override: `${this.region}/${AppPath.search}`,
    });

    if (!this.qaSets) {
      this.qaSets = await this.offersService.getQAs(this.region);
    }
    this.searchService.setSource(this.qaSets);

    this.route.queryParams.subscribe((queryParams: Params) => {
      this.handleQueryParams(queryParams);
    });
  }

  private handleQueryParams(params: Params) {
    this.searchQuery = params.q ? params.q : '';

    if (params.q) {
      this.performSearch(params.q);
    }
  }

  public onSearchInput(rawQuery: string) {
    const safeQuery = this.useSearchApi
      ? rawQuery
      : this.searchService.sanitizeSearchQuery(rawQuery);

    this.router.navigate([], {
      queryParams: { q: safeQuery },
      queryParamsHandling: 'merge',
    });
  }

  public async performSearch(query: string): Promise<void> {
    const safeQuery = this.searchService.sanitizeSearchQuery(query);

    if (this.useSearchApi) {
      this.loadingSearch = true;
      const apiResponse: SearchApiResponse =
        await this.fetchApiResults(safeQuery);

      if (apiResponse) {
        this.loadingSearch = false;
      }
      if (apiResponse && apiResponse.results) {
        this.searchResults = await this.createSearchResults(
          apiResponse.results,
        );
      }
    } else {
      this.searchResults = this.searchService.query(safeQuery);
    }

    if (this.searchResults.length > 1) {
      this.pageMeta.setTitle({
        pageName: `${this.regionData?.labelSearchPageTitle} (${this.searchResults.length})`,
        region: this.region,
      });

      const resultFrame = document.getElementById('search-results');
      if (resultFrame) {
        resultFrame.focus();
      }
    }
  }

  private async createSearchResults(
    results: SearchApiResultItem[],
  ): Promise<QASet[]> {
    const searchResults: QASet[] = [];
    results.forEach(async (item) => {
      const foundQASet = await this.offersService.findQA({
        region: this.region,
        categoryID: item.categoryID,
        subCategoryID: item.subCategoryID,
        question: item.question,
        slug: item.slug,
      });
      if (foundQASet) {
        searchResults.push(foundQASet);
      }
    });
    return searchResults;
  }

  private async fetchApiResults(query: string): Promise<SearchApiResponse> {
    const response = await window.fetch(environment.searchApi, {
      method: 'POST',
      credentials: 'omit',
      mode: 'cors',
      headers: {
        Authorization: environment.searchApiKey,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        googleSheetId: this.configService.getRegionByRegionSlug(this.region)
          .sheetId,
        lang: this.regionData.localeLanguage,
        k: SEARCH_API_RESULT_LIMIT,
      }),
    });

    if (!response || !response.ok) {
      console.warn('Something went wrong:', response);
      return {
        results: [],
      };
    }

    const body: SearchApiResponse = await response.json();
    const results = body.results?.map((item) => {
      // Fix typo in the API response
      if (item.subcategoryID) {
        item.subCategoryID = item.subcategoryID;
        delete item.subcategoryID;
      }
      return item;
    });

    return { results };
  }
}
