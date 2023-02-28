import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MarkdownModule } from 'ngx-markdown';
import {
  LoggingEvent,
  LoggingEventCategory,
} from 'src/app/models/logging-event.enum';
import { Offer } from 'src/app/models/offer.model';
import { LoggingService } from 'src/app/services/logging.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-offer-link',
  templateUrl: './offer-link.component.html',
  styleUrls: ['./offer-link.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, MarkdownModule],
})
export class OfferLinkComponent {
  public useUrlSlugs = environment.useUrlSlugs;

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
