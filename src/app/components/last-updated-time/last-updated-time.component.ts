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
      .subscribe(this.lastUpdatedTimeChange);
  }

  private lastUpdatedTimeChange(lastUpdatedTime: string) {
    this.lastUpdatedTime = lastUpdatedTime;
  }
}
