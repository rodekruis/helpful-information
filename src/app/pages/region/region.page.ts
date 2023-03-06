import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { CategoryLinkComponent } from 'src/app/components/category-link/category-link.component';
import { Category } from 'src/app/models/category.model';
import { QASet } from 'src/app/models/qa-set.model';
import { RegionData } from 'src/app/models/region-data';
import { SubCategory } from 'src/app/models/sub-category.model';
import { OffersService } from 'src/app/services/offers.service';
import { PageMetaService } from 'src/app/services/page-meta.service';
import { RegionDataService } from 'src/app/services/region-data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-region-page',
  templateUrl: './region.page.html',
  styleUrls: ['./region.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, CategoryLinkComponent, MarkdownModule],
})
export default class RegionPageComponent implements OnInit {
  public useQandAs = environment.useQandAs;
  public useQandASearch = environment.useQandASearch;

  private region: string;
  public regionData: RegionData;
  public categories: Category[];
  private subCategories: SubCategory[];
  public qaSets: QASet[];
  public qaHighlights: QASet[];

  constructor(
    private route: ActivatedRoute,
    private regionDataService: RegionDataService,
    private offersService: OffersService,
    private pageMeta: PageMetaService,
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(async (params: Params) => {
      this.region = params.region;

      if (!this.region) return;

      this.regionData = await this.regionDataService.getData(this.region);

      this.pageMeta.setTitle({
        region: this.regionData.pageTitle,
      });

      this.pageMeta.setCanonicalUrl({
        region: this.region,
      });

      this.categories = await this.offersService.getCategories(this.region);
      this.subCategories = await this.offersService.getAllSubCategories(
        this.region,
      );

      this.qaSets = await this.offersService.getQAs(this.region);
      this.qaHighlights = await this.offersService.getHighlights(this.region);
    });
  }

  public getOnlyChildSubCategory(category: Category): SubCategory | null {
    return this.offersService.getOnlyChildSubCategory(
      category,
      this.subCategories,
    );
  }
}
