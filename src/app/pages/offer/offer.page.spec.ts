import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { LoggingService } from 'src/app/services/logging.service';
import { OfferPageComponent } from './offer.page';

describe('OfferPageComponent', () => {
  let component: OfferPageComponent;
  let fixture: ComponentFixture<OfferPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), RouterTestingModule, OfferPageComponent],
      providers: [
        {
          provide: LoggingService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OfferPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
