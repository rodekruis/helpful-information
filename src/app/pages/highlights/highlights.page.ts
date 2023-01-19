import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { QASetListComponent } from 'src/app/components/q-a-set-list/q-a-set-list.component';
import { QASet } from 'src/app/models/qa-set.model';
import { RegionData } from 'src/app/models/referral-page-data';
import { OffersService } from 'src/app/services/offers.service';
import { RegionDataService } from 'src/app/services/region-data.service';

@Component({
  selector: 'app-highlights-page',
  templateUrl: './highlights.page.html',
  styleUrls: ['./highlights.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, QASetListComponent],
})
export class HighlightsPageComponent implements OnInit {
  public region: string;
  public regionData: RegionData;
  public qaHighlights: QASet[];

  constructor(
    private route: ActivatedRoute,
    private regionDataService: RegionDataService,
    private offersService: OffersService,
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(async (params: Params) => {
      this.region = params.region;

      if (!this.region && this.route.snapshot.parent) {
        this.region = this.route.snapshot.parent.params.region;
      }

      if (!this.region) return;

      this.regionData = await this.regionDataService.getData(this.region);

      if (!this.qaHighlights) {
        this.qaHighlights = await this.offersService.getHighlights(this.region);
      }
    });
  }
}
