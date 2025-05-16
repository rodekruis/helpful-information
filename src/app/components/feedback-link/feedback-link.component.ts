import { NgIf } from '@angular/common';
import type {
  ElementRef,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Component, Input, SecurityContext, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
  LoggingEvent,
  LoggingEventCategory,
} from 'src/app/models/logging-event.enum';
import { LoggingService } from 'src/app/services/logging.service';
import { fillTemplateWithUrl } from 'src/app/shared/utils';
import { environment } from 'src/environments/environment';

enum AnswerValue {
  Positive = 'Y',
  Negative = 'N',
}

@Component({
  selector: 'app-feedback-link',
  templateUrl: './feedback-link.component.html',
  styleUrls: ['./feedback-link.component.css'],
  imports: [NgIf],
})
export class FeedbackLinkComponent implements OnChanges, OnInit {
  @ViewChild('details')
  private details: ElementRef<HTMLDetailsElement>;

  @Input()
  public template: string;

  @Input()
  public labels: {
    answerNegative?: string;
    answerPositive?: string;
    question?: string;
    resultNegative?: string;
    resultPostive?: string;
    shareCta?: string;
    thanks?: string;
  };

  public AnswerValue = AnswerValue;
  public safeUrl: string;
  public isEnabled = environment.useFeedbackPrompt;

  public answerValue: AnswerValue | null = null;

  constructor(
    private domSanitizer: DomSanitizer,
    private loggingService: LoggingService,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.template && changes.template.currentValue) {
      this.ngOnInit();
    }
  }

  ngOnInit() {
    if (!this.isEnabled) {
      return;
    }

    if (!this.isTemplateValid(this.template)) {
      return;
    }

    const url = fillTemplateWithUrl(this.template, window.location.href);
    this.safeUrl = this.domSanitizer.sanitize(SecurityContext.URL, url);

    this.show();
  }

  private isTemplateValid(template: string): boolean {
    // Template should at least be a feasible URL, i.e. "https://a.bc/d" or "mailto:a@b.cd"
    return (
      !!template &&
      template.length > 12 &&
      (template.startsWith('https://') || template.startsWith('mailto:'))
    );
  }

  public show(): void {
    if (this.details && !this.details.nativeElement.open) {
      this.details.nativeElement.open = true;
    }

    this.loggingService.logEvent(
      LoggingEventCategory.ai,
      LoggingEvent.FeedbackPromptVisible,
    );
  }

  public toggle(target: EventTarget | HTMLDetailsElement): void {
    if ((target as HTMLDetailsElement).open) {
      return;
    }

    this.loggingService.logEvent(
      LoggingEventCategory.ai,
      LoggingEvent.FeedbackPromptDismissed,
    );
  }

  public answer(value: AnswerValue): void {
    this.answerValue = value;

    this.loggingService.logEvent(
      LoggingEventCategory.ai,
      LoggingEvent.FeedbackAnswered,
      {
        name: value, // Use "name"-property for Matomo
        answer: value,
      },
    );
  }

  public shareClick(): void {
    this.loggingService.logEvent(
      LoggingEventCategory.ai,
      LoggingEvent.FeedbackShareUrlClick,
    );
  }
}
