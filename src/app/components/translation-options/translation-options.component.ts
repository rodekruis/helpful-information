import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import type { Event } from '@angular/router';
import { EventType, Router } from '@angular/router';
import {
  LoggingEvent,
  LoggingEventCategory,
} from 'src/app/models/logging-event.enum';
import type { RegionData } from 'src/app/models/region-data';
import { LoggingService } from 'src/app/services/logging.service';
import {
  createRegionSlugs,
  getRegionLabel,
} from 'src/app/shared/util.environment';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-translation-options',
  templateUrl: './translation-options.component.html',
  styleUrls: ['./translation-options.component.css'],
  standalone: true,
  imports: [NgIf, NgFor],
})
export class TranslationOptionsComponent {
  public useRegionPerLocale = environment.useRegionPerLocale;
  public languageOptions: RegionData['localeAlternatives'] = [];
  public currentLanguageLabel: string | null;

  private _sourceLanguage: string;

  @Input()
  get sourceLanguage(): string {
    return this._sourceLanguage;
  }
  set sourceLanguage(language) {
    this._sourceLanguage = language;
    this.currentLanguageLabel = this.getLabel(language);
    this.languageOptions = this.updateLanguageOptions(this.languageOptions);
  }

  @Input()
  public languageOptionsExplanation: string;

  @Input()
  set localeAlternatives(value: RegionData['localeAlternatives']) {
    if (!this.useRegionPerLocale && value && value.length) {
      this.languageOptions = this.updateLanguageOptions(value);
    }
  }

  constructor(
    private router: Router,
    private loggingService?: LoggingService,
  ) {
    if (this.useRegionPerLocale) {
      this.languageOptions = this.createLocalLanguageOptions();
    }

    this.router.events.subscribe((event: Event) => {
      if (event.type !== EventType.NavigationEnd) {
        return;
      }

      this.languageOptions = this.updateLanguageOptions(this.languageOptions);
    });
  }

  public getCurrentUrl(): string {
    return window.location.href;
  }

  private getLabel(languageKey: string): string | null {
    if (!this.languageOptions) {
      return null;
    }

    let languageOption = this.languageOptions.find(
      (lang) => lang.key === languageKey,
    );

    if (!languageOption) {
      // Use the first language as fallback value
      languageOption = this.languageOptions[0];
    }

    if (languageOption && languageOption.label) {
      return languageOption.label;
    }

    return null;
  }

  private getUrl(
    sourceLanguageKey: string,
    targetLanguageKey: string,
    currentUrl: string,
  ): string {
    if (!sourceLanguageKey) {
      return '';
    }

    if (this.useRegionPerLocale) {
      const newUrl = currentUrl.replace(
        `/${sourceLanguageKey}`,
        `/${targetLanguageKey}`,
      );

      return newUrl;
    }

    return this.getGoogleTranslateUrl(
      sourceLanguageKey,
      targetLanguageKey,
      currentUrl,
    );
  }

  private getGoogleTranslateUrl(
    sourceLanguage: string,
    targetLanguage: string,
    currentUrl: string,
  ): string {
    return `https://translate.google.com/translate?sl=${sourceLanguage}&tl=${targetLanguage}&u=${currentUrl}`;
  }

  private createLocalLanguageOptions(): RegionData['localeAlternatives'] {
    const regions = createRegionSlugs();

    return regions.map((region: string) => {
      return {
        key: region,
        label: getRegionLabel(region),
      };
    });
  }

  private updateLanguageOptions(
    languageOptions: RegionData['localeAlternatives'],
  ): RegionData['localeAlternatives'] {
    const currentUrl = this.getCurrentUrl();

    return languageOptions.map((languageOption) => {
      languageOption.url = this.getUrl(
        this.sourceLanguage,
        languageOption.key,
        currentUrl,
      );

      return languageOption;
    });
  }

  public toggle(target: EventTarget | HTMLDetailsElement): void {
    if (!this.loggingService) {
      return;
    }
    this.loggingService.logEvent(
      LoggingEventCategory.ai,
      (target as HTMLDetailsElement).open
        ? LoggingEvent.LanguageOptionsOpen
        : LoggingEvent.LanguageOptionsClose,
    );
  }
}