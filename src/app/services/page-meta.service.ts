import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { RegionDataService } from './region-data.service';

@Injectable({
  providedIn: 'root',
})
export class PageMetaService {
  constructor(
    private regionData: RegionDataService,
    private titleService: Title,
  ) {}

  public setTitle(parts: {
    offerName?: string;
    subCategoryName?: string;
    categoryName?: string;
    region?: string;
    override?: string;
  }) {
    let title = '';

    if (!!parts.offerName) {
      title += parts.offerName + ' - ';
    }

    if (!!parts.subCategoryName) {
      title += parts.subCategoryName + ' - ';
    }

    if (!!parts.categoryName) {
      title += parts.categoryName + ' - ';
    }

    if (!!parts.region) {
      title += parts.region;
    }

    if (!parts.region && !parts.override) {
      title += this.regionData?.data?.pageTitle || '';
    }

    if (!!parts.override) {
      title = parts.override;
    }

    if (!!environment.envName) {
      title += ` [ ${environment.envName} ]`;
    }

    this.titleService.setTitle(title);
  }
}
