import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  LoggingEvent,
  LoggingEventCategory,
} from 'src/app/models/logging-event.enum';
import { LoggingService } from 'src/app/services/logging.service';
import { getRegionLabel } from 'src/app/shared/util.environment';

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
    this.label = getRegionLabel(value);
  }

  constructor(private loggingService: LoggingService) {}

  public click() {
    this.loggingService.logEvent(
      LoggingEventCategory.ai,
      LoggingEvent.ParentLinkClick,
    );
  }
}
