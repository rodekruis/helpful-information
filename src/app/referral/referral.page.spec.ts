import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LoggingService } from 'src/app/services/logging.service';
import { ngxMarkdownModuleFactory } from 'src/main';

import { ReferralPageComponent } from './referral.page';

describe('ReferralPageComponent', () => {
  let component: ReferralPageComponent;
  let fixture: ComponentFixture<ReferralPageComponent>;

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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render 3 visible test-region(s)', () => {
    // Assert
    const listItems = fixture.debugElement.nativeElement.querySelectorAll(
      'li:not([aria-hidden="true"])',
    );

    expect(listItems.length).toEqual(3);
  });

  it('should render 3 visible buttons for test-region(s)', () => {
    // Assert
    const listItems =
      fixture.debugElement.nativeElement.querySelectorAll('li a[href]');

    expect(listItems.length).toEqual(3);
  });
});
