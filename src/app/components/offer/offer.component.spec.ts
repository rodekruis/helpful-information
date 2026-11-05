import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import mockOffer from 'src/app/mocks/offer.mock';
import { LoggingService } from 'src/app/services/logging.service';
import { ngxMarkdownModuleFactory } from 'src/app/shared/ngx-markdown.factory';

import { OfferComponent } from './offer.component';

describe('OfferComponent', () => {
  let component: OfferComponent;
  let fixture: ComponentFixture<OfferComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ngxMarkdownModuleFactory()],
      providers: [
        provideRouter([]),
        {
          provide: LoggingService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OfferComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    // Arrange
    fixture.componentRef.setInput('offer', mockOffer);

    // Act
    fixture.detectChanges();

    // Assert
    expect(component).toBeTruthy();
  });
});
