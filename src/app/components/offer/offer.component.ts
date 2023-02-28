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

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, MarkdownModule],
})
export class OfferComponent {
  @Input()
  public offer: Offer;

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
