import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonImg,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { RegionDataFallback } from 'src/app/models/region-data';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [
    NgIf,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    IonThumbnail,
    IonImg,
  ],
})
export class AppHeaderComponent {
  @Input()
  public title: string;

  @Input()
  public loading: boolean;

  @Input()
  public backButtonLabel: string;

  @Output()
  public backAction = new EventEmitter<MouseEvent>();

  @Input()
  public logoUrl: string;

  @Input()
  public logoActionLabel: string;

  @Output()
  public logoAction = new EventEmitter<MouseEvent>();

  public fallbackTitle = environment.appName;
  public fallbackLogoUrl = environment.appLogoUrl;
  public fallbackActionLabel = RegionDataFallback.labelMainScreenButton;

  public backClick($event: MouseEvent) {
    return this.backAction.emit($event);
  }

  public logoClick($event: MouseEvent) {
    $event.preventDefault();
    return this.logoAction.emit($event);
  }
}
