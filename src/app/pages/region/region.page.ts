import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import type { Params } from '@angular/router';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { CategoryLinkComponent } from 'src/app/components/category-link/category-link.component';
import type { Category } from 'src/app/models/category.model';
import type { QASet } from 'src/app/models/qa-set.model';
import type { RegionData } from 'src/app/models/region-data';
import type { SubCategory } from 'src/app/models/sub-category.model';
import { OffersService } from 'src/app/services/offers.service';
import { PageMetaService } from 'src/app/services/page-meta.service';
import { RegionDataService } from 'src/app/services/region-data.service';
import { environment } from 'src/environments/environment';
import { AppPath } from 'src/routes';

@Component({
  selector: 'app-region-page',
  templateUrl: './region.page.html',
  styleUrls: ['./region.page.css'],
  imports: [RouterLink, CategoryLinkComponent, MarkdownModule],
})
export default class RegionPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private regionDataService = inject(RegionDataService);
  private offersService = inject(OffersService);
  private pageMeta = inject(PageMetaService);

  public useQandAs = environment.useQandAs;
  public useQandASearch = environment.useQandASearch;
  public AppPath = AppPath;

  private region: string;
  public regionData: RegionData;
  public categories: Category[];
  private subCategories: SubCategory[];
  public qaSets: QASet[];
  public qaHighlights: QASet[];

  async ngOnInit() {
    this.route.params.subscribe(async (params: Params) => {
      this.region = params.region;

      if (!this.region) return;

      this.regionData = await this.regionDataService.getData(this.region);

      this.pageMeta.setDirection(this.regionData.localeDirection);
      this.pageMeta.setLanguage(this.regionData.localeLanguage);

      this.pageMeta.setTitle({
        region: this.region,
      });

      this.pageMeta.setCanonicalUrl({
        region: this.region,
      });

      this.categories = await this.offersService.getCategories(this.region);
      this.subCategories = await this.offersService.getAllSubCategories(
        this.region,
      );

      if (this.useQandAs) {
        this.qaSets = await this.offersService.getQAs(this.region);
        this.qaHighlights = await this.offersService.getHighlights(this.region);
      }
    });
  }

  public getOnlyChildSubCategory(category: Category): SubCategory | null {
    return this.offersService.getOnlyChildSubCategory(
      category,
      this.subCategories,
    );
  }
}
