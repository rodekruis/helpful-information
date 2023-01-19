import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { QASetListComponent } from 'src/app/components/q-a-set-list/q-a-set-list.component';
import { QASet } from 'src/app/models/qa-set.model';
import { ReferralPageData } from 'src/app/models/referral-page-data';
import { OffersService } from 'src/app/services/offers.service';
import { ReferralPageDataService } from 'src/app/services/referral-page-data.service';

@Component({
  selector: 'app-highlights-page',
  templateUrl: './highlights.page.html',
  styleUrls: ['./highlights.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, QASetListComponent],
})
export class HighlightsPageComponent implements OnInit {
  public region: string;
  public regionData: ReferralPageData;
  public qaHighlights: QASet[];

  constructor(
    private route: ActivatedRoute,
    private regionDataService: ReferralPageDataService,
    private offersService: OffersService,
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(async (params: Params) => {
      this.region = params.region;

      if (!this.region && this.route.snapshot.parent) {
        this.region = this.route.snapshot.parent.params.region;
      }

      if (!this.region) return;

      this.regionData = await this.regionDataService.getReferralPageData(
        this.region,
      );

      if (!this.qaHighlights) {
        this.qaHighlights = await this.offersService.getHighlights(this.region);
      }
    });
  }
}
