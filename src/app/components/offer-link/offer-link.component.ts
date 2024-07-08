import { NgIf, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonImg } from '@ionic/angular/standalone';
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
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MarkdownModule, IonImg, RouterLink, NgIf, SlicePipe],
})
export class OfferLinkComponent {
  @Input()
  public offer: Offer;

  constructor(private loggingService?: LoggingService) {}

  public click(offer: Offer) {
    if (!this.loggingService) {
      return;
    }
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
