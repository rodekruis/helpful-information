import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { QASetListComponent } from 'src/app/components/q-a-set-list/q-a-set-list.component';
import { SearchInputComponent } from 'src/app/components/search-input/search-input.component';
import { QASet } from 'src/app/models/qa-set.model';
import { RegionData } from 'src/app/models/region-data';
import { OffersService } from 'src/app/services/offers.service';
import { PageMetaService } from 'src/app/services/page-meta.service';
import { RegionDataService } from 'src/app/services/region-data.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    QASetListComponent,
    SearchInputComponent,
  ],
})
export default class SearchPageComponent implements OnInit {
  private region: string;
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

    this.pageMeta.setTitle({
      override: `${this.regionData?.labelSearchPageTitle} - ${this.regionData?.pageTitle}`,
    });
    this.pageMeta.setCanonicalUrl({
      override: this.region + '/search',
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
    this.searchQuery = !!params.q ? params.q : '';

    if (!!params.q) {
      this.performSearch(params.q);
    }
  }

  public performSearch(rawQuery: string): void {
    const safeQuery = this.searchService.sanitizeSearchQuery(rawQuery);

    this.router.navigate([], {
      queryParams: { q: safeQuery },
      queryParamsHandling: 'merge',
    });

    this.searchResults = this.searchService.query(safeQuery);

    if (this.searchResults.length > 1) {
      this.pageMeta.setTitle({
        override: `${this.regionData?.labelSearchPageTitle} (${this.searchResults.length}) - ${this.regionData?.pageTitle}`,
      });

      const resultFrame = document.getElementById('search-results');
      if (resultFrame) {
        resultFrame.focus();
      }
    }
  }
}
