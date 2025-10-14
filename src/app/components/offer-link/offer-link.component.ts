import { SlicePipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import {
  LoggingEvent,
  LoggingEventCategory,
} from 'src/app/models/logging-event.enum';
import type { Offer } from 'src/app/models/offer.model';
import { LoggingService } from 'src/app/services/logging.service';

@Component({
  selector: 'app-offer-link',
  templateUrl: './offer-link.component.html',
  styleUrls: ['./offer-link.component.css'],
  imports: [MarkdownModule, RouterLink, SlicePipe],
})
export class OfferLinkComponent {
  private loggingService = inject(LoggingService);

  @Input()
  public offer: Offer;

  public click(offer: Offer) {
    this.loggingService.logEvent(
      LoggingEventCategory.ai,
      LoggingEvent.OfferClick,
      {
        categoryID: offer.categoryID,
        categorySlug: offer.categorySlug ? offer.categorySlug : '',
        category: offer.categoryName,
        subCategoryID: offer.subCategoryID,
        subCategorySlug: offer.subCategorySlug ? offer.subCategorySlug : '',
        subCategory: offer.subCategoryName,
        offerID: offer.offerID,
        offerSlug: offer.slug ? offer.slug : '',
        offerName: offer.offerName ? offer.offerName : '',
      },
    );
  }
}
