import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonImg, IonThumbnail } from '@ionic/angular/standalone';
import { RegionDataFallback } from 'src/app/models/region-data';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [NgIf, IonThumbnail, IonImg],
})
export class AppHeaderComponent {
  @Input()
  public title: string;

  @Input()
  public logoUrl: string;

  @Input()
  public logoActionLabel: string;

  @Output()
  public logoAction = new EventEmitter<MouseEvent>();

  public fallbackTitle = environment.appName;
  public fallbackLogoUrl = environment.appLogoUrl;
  public fallbackActionLabel = RegionDataFallback.labelMainScreenButton;

  public logoClick($event: MouseEvent) {
    $event.preventDefault();
    return this.logoAction.emit($event);
  }
}
