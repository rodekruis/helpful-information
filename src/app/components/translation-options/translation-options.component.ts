import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RegionData } from 'src/app/models/region-data';

@Component({
  selector: 'app-translation-options',
  templateUrl: './translation-options.component.html',
  styleUrls: ['./translation-options.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class TranslationOptionsComponent {
  @Input()
  public sourceLanguage = 'en';

  @Input()
  public labelTranslationsGoogle: string;

  @Input()
  public languageOptions: RegionData['localeAlternatives'];

  getCurrentUrl(): string {
    return window.location.href;
  }

  getCurrentLanguageLabel(): string {
    if (!this.languageOptions) {
      return '';
    }
    const sourceLanguageSet = this.languageOptions.find(
      (lang) => lang.key === this.sourceLanguage,
    );

    if (!!sourceLanguageSet) {
      return sourceLanguageSet.label;
    }

    return this.languageOptions[0] ? this.languageOptions[0].label : '';
  }
}
