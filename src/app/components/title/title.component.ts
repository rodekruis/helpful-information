import { Component, Input } from '@angular/core';
import { LogoService } from 'src/app/services/logo.service';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss'],
})
export class TitleComponent {
  @Input()
  title: string;

  @Input()
  loading: boolean;

  public logoUrl: string;

  constructor(private logoService: LogoService) {
    this.logoService.logo$.subscribe((url) => {
      this.logoUrl = url;
    });
  }
}
