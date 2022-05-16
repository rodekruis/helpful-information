import { Component } from '@angular/core';
import { LastUpdatedTimeService } from 'src/app/services/last-updated-time.service';

@Component({
  selector: 'app-last-updated-time',
  templateUrl: './last-updated-time.component.html',
  styleUrls: ['./last-updated-time.component.scss'],
})
export class LastUpdatedTimeComponent {
  public lastUpdatedTime: string;

  constructor(private lastUpdatedTimeService: LastUpdatedTimeService) {
    this.lastUpdatedTimeService.lastUpdatedTime$.subscribe((value) => {
      // Don't act on invalid Date-values:
      if (Number.isNaN(Date.parse(value))) {
        return;
      }
      this.lastUpdatedTime = value;
    });
  }
}
