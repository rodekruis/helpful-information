import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggingService } from 'src/app/services/logging.service';
import { ngxMarkdownModuleFactory } from 'src/main';

import { ReferralPageComponent } from './referral.page';

describe('ReferralPageComponent', () => {
  let component: ReferralPageComponent;
  let fixture: ComponentFixture<ReferralPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ngxMarkdownModuleFactory()],
      providers: [
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

  it('should render 1 (visible) test-region', () => {
    // Assert
    const listItems = fixture.debugElement.nativeElement.querySelectorAll(
      'li:not([aria-hidden])',
    );

    expect(listItems.length).toEqual(1);
  });
});
