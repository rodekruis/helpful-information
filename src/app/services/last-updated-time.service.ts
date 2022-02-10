import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LastUpdatedTimeService {
  private lastUpdatedTime = new BehaviorSubject<string>('');

  public lastUpdatedTime$: Observable<string>;

  constructor() {
    this.lastUpdatedTime$ = this.lastUpdatedTime.asObservable();
  }

  public setLastUpdatedTime(value: string): void {
    this.lastUpdatedTime.next(value);
  }
}
