import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LogoService } from 'src/app/services/logo.service';

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
  public logoActionLabel: string;

  @Output()
  public logoAction = new EventEmitter<MouseEvent>();

  public logoUrl: string;

  constructor(private logoService: LogoService) {
    this.logoService.logo$.subscribe((url) => {
      this.logoUrl = url;
    });
  }

  public backClick($event: MouseEvent) {
    return this.backAction.emit($event);
  }

  public logoClick($event: MouseEvent) {
    $event.preventDefault();
    return this.logoAction.emit($event);
  }
}
