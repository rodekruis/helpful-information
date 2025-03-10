import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonImg } from '@ionic/angular/standalone';
import { MarkdownModule } from 'ngx-markdown';
import {
  LoggingEvent,
  LoggingEventCategory,
} from 'src/app/models/logging-event.enum';
import type { Offer } from 'src/app/models/offer.model';
import type { RegionData } from 'src/app/models/region-data';
import { LoggingService } from 'src/app/services/logging.service';
import { formatPhoneNumberAsUrl } from 'src/app/shared/utils';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss'],
  imports: [MarkdownModule, IonImg, NgIf, NgFor],
})
export class OfferComponent {
  @Input()
  public offer: Offer;

  @Input()
  public regionData: RegionData = {};

  public formatPhoneNumberAsUrl = formatPhoneNumberAsUrl;

  constructor(private loggingService: LoggingService) {}

  public logDetailClick(name: string) {
    this.loggingService.logEvent(
      LoggingEventCategory.ai,
      LoggingEvent.OfferDetailClick,
      { name },
    );
  }
}
