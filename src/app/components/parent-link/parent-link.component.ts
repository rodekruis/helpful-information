import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LoggingEvent,
  LoggingEventCategory,
} from 'src/app/models/logging-event.enum';
import { ConfigService } from 'src/app/services/config.service';
import { LoggingService } from 'src/app/services/logging.service';

@Component({
  selector: 'app-parent-link',
  templateUrl: './parent-link.component.html',
  styleUrls: ['./parent-link.component.css'],
  standalone: true,
  imports: [RouterLink],
})
export class ParentLinkComponent {
  @Input()
  public label: string;

  @Input()
  set region(value: string) {
    this.label = this.configService.getRegionByRegionSlug(value)?.label;
  }

  constructor(
    private loggingService: LoggingService,
    private configService: ConfigService,
  ) {}

  public click() {
    this.loggingService.logEvent(
      LoggingEventCategory.ai,
      LoggingEvent.ParentLinkClick,
    );
  }
}
