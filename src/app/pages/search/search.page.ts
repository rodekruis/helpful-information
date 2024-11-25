import { NgIf } from '@angular/common';
import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import type { Params } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
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

type SearchApiResponse = {
  status?: number;
  references?: {
    category: string;
    subcategory: string;
    slug?: string;
    parent?: string;
  }[];
};

@Component({
  selector: 'app-search-page',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.css'],
  standalone: true,
  imports: [
    NgIf,
    QASetListComponent,
    SearchInputComponent,
    ParentLinkComponent,
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
      if (apiResponse && apiResponse.references) {
        this.searchResults = this.createReferences(apiResponse.references);
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

  private createReferences(
    references: SearchApiResponse['references'],
  ): QASet[] {
    const results = references.map((reference) => {
      const result = this.qaSets.find((qa) => {
        return (
          qa.categoryID === Number(reference.category) &&
          qa.subCategoryID === Number(reference.subcategory)
        );
      });

      return result;
    });
    return results;
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
        question: query,
        googleSheetId: this.configService.getRegionByRegionSlug(this.region)
          .sheetId,
        locale: this.regionData.localeLanguage,
      }),
    });

    if (!response || !response.ok) {
      console.warn('Something went wrong:', response);
      return {
        references: [],
      };
    }

    return await response.json();
  }
}
