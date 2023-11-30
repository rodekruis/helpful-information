import { NgIf } from '@angular/common';
import type { OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Component, Input, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RegionDataFallback } from 'src/app/models/region-data';
import { fillTemplateWithUrl } from 'src/app/shared/utils';

@Component({
  selector: 'app-feedback-link',
  templateUrl: './feedback-link.component.html',
  styleUrls: ['./feedback-link.component.scss'],
  standalone: true,
  imports: [NgIf],
})
export class FeedbackLinkComponent implements OnChanges, OnInit {
  @Input()
  public template: string;

  @Input()
  public label: string = RegionDataFallback.labelFeedbackCta;

  public safeUrl: string;

  constructor(private domSanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.template && changes.template.currentValue) {
      this.ngOnInit();
    }
  }

  ngOnInit() {
    if (!this.isTemplateValid(this.template)) {
      return;
    }

    const url = fillTemplateWithUrl(this.template, window.location.href);
    this.safeUrl = this.domSanitizer.sanitize(SecurityContext.URL, url);
  }

  private isTemplateValid(template: string): boolean {
    // Template should at least be a feasible URL, i.e. "https://a.bc/d" or "mailto:a@b.cd"
    return (
      !!template &&
      template.length > 12 &&
      (template.startsWith('https://') || template.startsWith('mailto:'))
    );
  }
}
