import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { CategoryLinkComponent } from 'src/app/components/category-link/category-link.component';
import { Category } from 'src/app/models/category.model';
import { QASet } from 'src/app/models/qa-set.model';
import { ReferralPageData } from 'src/app/models/referral-page-data';
import { SubCategory } from 'src/app/models/sub-category.model';
import { OffersService } from 'src/app/services/offers.service';
import { ReferralPageDataService } from 'src/app/services/referral-page-data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-region-page',
  templateUrl: './region.page.html',
  styleUrls: ['./region.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, CategoryLinkComponent],
})
export class RegionPageComponent implements OnInit {
  public useQandAs = environment.useQandAs;
  public useQandASearch = environment.useQandASearch;

  public region: string;
  public regionData: ReferralPageData;
  public categories: Category[];
  public subCategories: SubCategory[];
  public qaSets: QASet[];
  public qaHighlights: QASet[];

  constructor(
    private route: ActivatedRoute,
    private regionDataService: ReferralPageDataService,
    private offersService: OffersService,
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(async (params: Params) => {
      this.region = params.region;

      if (!this.region) return;

      this.regionData = await this.regionDataService.getReferralPageData(
        this.region,
      );

      this.categories = await this.offersService.getCategories(this.region);
      this.subCategories = await this.offersService.getSubCategories(
        this.region,
      );
    });
  }

  public getOnlyChildSubCategory(category: Category): SubCategory | null {
    return this.offersService.getOnlyChildSubCategory(
      category,
      this.subCategories,
    );
  }
}