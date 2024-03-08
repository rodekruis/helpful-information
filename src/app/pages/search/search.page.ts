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
import { OffersService } from 'src/app/services/offers.service';
import { PageMetaService } from 'src/app/services/page-meta.service';
import { RegionDataService } from 'src/app/services/region-data.service';
import { SearchService } from 'src/app/services/search.service';
import { environment } from 'src/environments/environment';
import { AppPath } from 'src/routes';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private regionDataService: RegionDataService,
    private offersService: OffersService,
    private searchService: SearchService,
    private pageMeta: PageMetaService,
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
    const safeQuery = this.searchService.sanitizeSearchQuery(rawQuery);

    this.router.navigate([], {
      queryParams: { q: safeQuery },
      queryParamsHandling: 'merge',
    });
  }

  public async performSearch(query: string): Promise<void> {
    const safeQuery = this.searchService.sanitizeSearchQuery(query);

    this.searchResults = this.searchService.query(safeQuery);

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
}
