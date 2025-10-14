import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import type { Params } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ParentLinkComponent } from 'src/app/components/parent-link/parent-link.component';
import { QASetListComponent } from 'src/app/components/q-a-set-list/q-a-set-list.component';
import type { QASet } from 'src/app/models/qa-set.model';
import type { RegionData } from 'src/app/models/region-data';
import { OffersService } from 'src/app/services/offers.service';
import { PageMetaService } from 'src/app/services/page-meta.service';
import { RegionDataService } from 'src/app/services/region-data.service';
import { AppPath } from 'src/routes';

@Component({
  selector: 'app-highlights-page',
  templateUrl: './highlights.page.html',
  styleUrls: ['./highlights.page.css'],
  imports: [QASetListComponent, ParentLinkComponent],
})
export default class HighlightsPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private regionDataService = inject(RegionDataService);
  private offersService = inject(OffersService);
  private pageMeta = inject(PageMetaService);

  public region: string;
  public regionData: RegionData;
  public qaHighlights: QASet[];

  async ngOnInit() {
    this.route.params.subscribe(async (params: Params) => {
      this.region = params.region;

      if (!this.region && this.route.snapshot.parent) {
        this.region = this.route.snapshot.parent.params.region;
      }

      if (!this.region) return;

      this.regionData = await this.regionDataService.getData(this.region);

      this.pageMeta.setDirection(this.regionData.localeDirection);
      this.pageMeta.setLanguage(this.regionData.localeLanguage);

      if (!this.qaHighlights) {
        this.qaHighlights = await this.offersService.getHighlights(this.region);
      }

      let highlightsPageTitle = this.regionData?.labelHighlightsPageTitle;

      if (this.qaHighlights.length) {
        highlightsPageTitle += ` (${this.qaHighlights.length})`;
      }

      this.pageMeta.setTitle({
        pageName: highlightsPageTitle,
        region: this.region,
      });
      this.pageMeta.setCanonicalUrl({
        override: `${this.region}/${AppPath.highlights}`,
      });
    });
  }
}
