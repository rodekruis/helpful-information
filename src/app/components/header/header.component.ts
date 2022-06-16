import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
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

  public backClick($event: MouseEvent) {
    return this.backAction.emit($event);
  }

  public logoClick($event: MouseEvent) {
    $event.preventDefault();
    return this.logoAction.emit($event);
  }
}
