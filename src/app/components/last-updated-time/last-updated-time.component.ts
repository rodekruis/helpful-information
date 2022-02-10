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
      this.lastUpdatedTime = this.stripSeconds(value);
    });
  }

  private stripSeconds(value: string): string {
    return value.replace(/(\d{1,2}-\d{1,2}-\d{4} \d{1,2}:\d{1,2}):\d+/, '$1');
  }
}
