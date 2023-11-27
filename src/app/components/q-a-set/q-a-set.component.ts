import { DatePipe, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import {
  LoggingEvent,
  LoggingEventCategory,
} from 'src/app/models/logging-event.enum';
import type { QASet } from 'src/app/models/qa-set.model';
import { LoggingService } from 'src/app/services/logging.service';
import { RegionDataService } from 'src/app/services/region-data.service';

@Component({
  selector: 'app-q-a-set',
  templateUrl: './q-a-set.component.html',
  styleUrls: ['./q-a-set.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, NgTemplateOutlet, MarkdownModule],
})
export class QASetComponent {
  @Input()
  qaSet: QASet;

  @Input()
  public showParentDateUpdated = true;

  public labelLastUpdated: string;

  constructor(
    private regionDataService: RegionDataService,
    private loggingService?: LoggingService,
  ) {
    if (
      !!this.regionDataService &&
      !!this.regionDataService.data &&
      !!this.regionDataService.data.labelLastUpdated
    ) {
      this.labelLastUpdated = this.regionDataService.data.labelLastUpdated;
    }
  }

  public isActive(slug: string): boolean {
    return window.location.hash === `#${slug}`;
  }

  public logDetailsChange(target: any, slug?: string, question?: string): void {
    if (!this.loggingService) {
      return;
    }
    this.loggingService.logEvent(
      LoggingEventCategory.ai,
      target.open ? LoggingEvent.QuestionOpen : LoggingEvent.QuestionClose,
      {
        questionSlug: slug,
        question: question.substring(0, 100),
      },
    );
  }
}
