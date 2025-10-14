import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
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
  styleUrls: ['./q-a-set.component.css'],
  imports: [DatePipe, NgTemplateOutlet, MarkdownModule],
})
export class QASetComponent {
  private regionDataService = inject(RegionDataService);
  private loggingService = inject(LoggingService);

  @Input()
  qaSet: QASet;

  @Input()
  public showParentDateUpdated = true;

  public labelLastUpdated: string;

  constructor() {
    if (
      !!this.regionDataService &&
      !!this.regionDataService.data &&
      !!this.regionDataService.data.labelLastUpdated
    ) {
      this.labelLastUpdated = this.regionDataService.data.labelLastUpdated;
    }
  }

  public isActive(slug: string | undefined): boolean {
    return !!slug && window.location.hash === `#${slug}`;
  }

  public logDetailsChange(
    target: EventTarget | HTMLDetailsElement,
    slug?: string,
    question?: string,
  ): void {
    this.loggingService.logEvent(
      LoggingEventCategory.ai,
      (target as HTMLDetailsElement).open
        ? LoggingEvent.QuestionOpen
        : LoggingEvent.QuestionClose,
      {
        name: slug, // Use "name"-property for Matomo
        questionSlug: slug,
        question: question.substring(0, 100),
      },
    );
  }
}
