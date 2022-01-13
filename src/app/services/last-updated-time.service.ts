import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LastUpdatedTimeService {
  private lastUpdatedTime = new Subject<string>();

  constructor() {}

  public setLastUpdatedTime(lastUpdatedTime: string): void {
    this.lastUpdatedTime.next(lastUpdatedTime);
  }

  public getLastUpdatedTimeSubscription(): Observable<string> {
    return this.lastUpdatedTime.asObservable();
  }
}
