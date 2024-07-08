import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
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
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MarkdownModule, IonImg, NgIf, NgFor, RouterLink],
})
export class OfferComponent {
  @Input()
  public offer: Offer;

  @Input()
  public regionData: RegionData = {};

  public formatPhoneNumberAsUrl = formatPhoneNumberAsUrl;

  constructor(private loggingService?: LoggingService) {}

  public logDetailClick(name: string) {
    if (!this.loggingService) {
      return;
    }
    this.loggingService.logEvent(
      LoggingEventCategory.ai,
      LoggingEvent.OfferDetailClick,
      { name },
    );
  }
}
