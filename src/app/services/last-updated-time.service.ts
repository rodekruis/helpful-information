import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LastUpdatedTimeService {
  private lastUpdatedTime = new BehaviorSubject<string>('');
  private lastUpdatedLabel = new BehaviorSubject<string>('');

  public lastUpdatedTime$: Observable<string>;
  public lastUpdatedLabel$: Observable<string>;

  constructor() {
    this.lastUpdatedTime$ = this.lastUpdatedTime.asObservable();
    this.lastUpdatedLabel$ = this.lastUpdatedLabel.asObservable();
  }

  public setLastUpdatedTime(value: string): void {
    this.lastUpdatedTime.next(value);
  }

  public setLastUpdatedLabel(value: string): void {
    this.lastUpdatedLabel.next(value);
  }
}
