import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslationOptionsComponent } from 'src/app/components/translation-options/translation-options.component';
import type { RegionData } from 'src/app/models/region-data';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [NgIf, TranslationOptionsComponent],
})
export class AppHeaderComponent {
  @Input()
  public title: string;

  @Input()
  public mainUrl = '/';

  @Input()
  public logoUrl: string;

  @Output()
  public logoAction = new EventEmitter<MouseEvent>();

  @Input()
  public currentLanguage: string;

  @Input()
  public localeAlternatives: RegionData['localeAlternatives'] = [];

  @Input()
  public languageOptionsExplanation: string;

  public fallbackTitle = environment.appName;
  public fallbackLogoUrl = environment.appLogoUrl;

  public logoClick($event: MouseEvent) {
    $event.preventDefault();
    return this.logoAction.emit($event);
  }
}
