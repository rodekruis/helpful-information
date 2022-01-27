import { Component, Input } from '@angular/core';
import { LastUpdatedTimeService } from 'src/app/services/last-updated-time.service';

@Component({
  selector: 'app-last-updated-time',
  templateUrl: './last-updated-time.component.html',
  styleUrls: ['./last-updated-time.component.scss'],
})
export class LastUpdatedTimeComponent {
  @Input()
  loading: boolean;

  public lastUpdatedTime: string;

  constructor(private lastUpdatedTimeService: LastUpdatedTimeService) {
    this.lastUpdatedTimeService
      .getLastUpdatedTimeSubscription()
      .subscribe((lastUpdatedTime) => {
        this.lastUpdatedTime = this.stripSeconds(lastUpdatedTime);
      });
  }

  private stripSeconds(value: string): string {
    return value.replace(/(\d{1,2}-\d{1,2}-\d{4} \d{1,2}:\d{1,2}):\d+/, '$1');
  }
}
