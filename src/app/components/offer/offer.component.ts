import { Component, Input } from '@angular/core';
import {
  LoggingEvent,
  LoggingEventCategory,
} from 'src/app/models/logging-event.enum';
import { Offer } from 'src/app/models/offer.model';
import { LoggingService } from 'src/app/services/logging.service';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss'],
})
export class OfferComponent {
  @Input()
  offer: Offer;

  constructor(private loggingService: LoggingService) {}

  public logClick(name: string) {
    this.loggingService.logEvent(
      LoggingEventCategory.ai,
      LoggingEvent.OfferDetailClick,
      { name },
    );
  }
}
