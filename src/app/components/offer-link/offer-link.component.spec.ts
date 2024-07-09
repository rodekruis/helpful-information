import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LoggingService } from 'src/app/services/logging.service';

import { OfferLinkComponent } from './offer-link.component';

describe('OfferLinkComponent', () => {
  let component: OfferLinkComponent;
  let fixture: ComponentFixture<OfferLinkComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: LoggingService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OfferLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
