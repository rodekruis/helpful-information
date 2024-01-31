import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import type { RegionData } from 'src/app/models/region-data';

@Component({
  selector: 'app-translation-options',
  templateUrl: './translation-options.component.html',
  styleUrls: ['./translation-options.component.css'],
  standalone: true,
  imports: [NgIf, NgFor],
})
export class TranslationOptionsComponent {
  private _sourceLanguage = 'en';

  @Input()
  get sourceLanguage(): string {
    return this._sourceLanguage;
  }
  set sourceLanguage(language: string) {
    this._sourceLanguage = language;
    this.currentLanguageLabel = this.getLabel(language);
  }

  @Input()
  public languageOptionsExplanation: string;

  @Input()
  public languageOptions: RegionData['localeAlternatives'];

  public currentLanguageLabel: string | null;

  constructor() {}

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
}
