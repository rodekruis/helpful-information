import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LogoService {
  private logo = new BehaviorSubject<string>('assets/icons/icon_48.png');

  public logo$: Observable<string>;

  constructor() {
    this.logo$ = this.logo.asObservable();
  }

  public setLogo(value: string): void {
    this.logo.next(value);
  }
}
