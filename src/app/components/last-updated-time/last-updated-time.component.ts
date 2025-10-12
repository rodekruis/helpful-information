import { DatePipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { RegionDataFallback } from 'src/app/models/region-data';
import { LastUpdatedTimeService } from 'src/app/services/last-updated-time.service';

@Component({
  selector: 'app-last-updated-time',
  templateUrl: './last-updated-time.component.html',
  styleUrls: ['./last-updated-time.component.css'],
  imports: [DatePipe],
})
export class LastUpdatedTimeComponent {
  private lastUpdatedTimeService = inject(LastUpdatedTimeService);

  @Input()
  public label: string = RegionDataFallback.labelLastUpdated;

  public lastUpdatedTime: string;

  constructor() {
    this.lastUpdatedTimeService.lastUpdatedTime$.subscribe((value) => {
      // Don't act on invalid Date-values:
      if (Number.isNaN(Date.parse(value))) {
        return;
      }
      this.lastUpdatedTime = value;
    });

    this.lastUpdatedTimeService.lastUpdatedLabel$.subscribe((value) => {
      this.label = value;
    });
  }
}
