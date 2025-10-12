import { Location } from '@angular/common';
import { DOCUMENT, Inject, Injectable, SecurityContext } from '@angular/core';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { ConfigService } from 'src/app/services/config.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PageMetaService {
  constructor(
    private titleService: Title,
    @Inject(DOCUMENT) private dom: Document,
    private domSanitizer: DomSanitizer,
    private location: Location,
    private configService: ConfigService,
  ) {}

  public setDirection(direction: string = 'auto') {
    this.dom.documentElement.dir = direction;
  }

  public setLanguage(language: string = '') {
    this.dom.documentElement.lang = language;
  }

  public setTitle(parts: {
    pageName?: string;
    offerName?: string;
    subCategoryName?: string;
    categoryName?: string;
    region?: string;
    override?: string;
  }) {
    let title = '';
    const separator = ' - ';

    if (parts.pageName) {
      title += parts.pageName + separator;
    }

    if (parts.offerName) {
      title += parts.offerName + separator;
    }

    if (parts.subCategoryName) {
      title += parts.subCategoryName + separator;
    }

    if (parts.categoryName) {
      title += parts.categoryName + separator;
    }

    if (parts.region) {
      title +=
        this.configService.getRegionByRegionSlug(parts.region)?.label +
        separator;
    }

    // App name as a base-title
    title += environment.appName || '';

    if (parts.override) {
      title = parts.override;
    }

    if (environment.envName) {
      title += ` [ ${environment.envName} ]`;
    }

    this.titleService.setTitle(title);
  }

  public setCanonicalUrl(parts: {
    offerSlug?: string;
    subCategorySlug?: string;
    categorySlug?: string;
    region?: string;
    override?: string;
  }): void {
    let canonicalUrl = '';

    if (parts.region) {
      canonicalUrl += parts.region;
    }
    if (parts.categorySlug) {
      canonicalUrl += '/' + parts.categorySlug;
    }
    if (parts.subCategorySlug) {
      canonicalUrl += '/' + parts.subCategorySlug;
    }
    if (parts.offerSlug) {
      canonicalUrl += '/' + parts.offerSlug;
    }

    if (parts.override) {
      canonicalUrl = parts.override;
    }

    let link: HTMLLinkElement = this.dom.querySelector('link[rel=canonical]');

    if (!link) {
      link = this.dom.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.dom.head.appendChild(link);
    }

    const absoluteUrl =
      this.dom.location.origin + this.location.prepareExternalUrl(canonicalUrl);

    link.setAttribute(
      'href',
      this.domSanitizer.sanitize(SecurityContext.URL, absoluteUrl),
    );
  }
}
