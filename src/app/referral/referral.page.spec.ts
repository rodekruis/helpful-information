import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OfferComponent } from 'src/app/components/offer/offer.component';
import { SubCategoryComponent } from 'src/app/components/sub-category/sub-category.component';
import { CategoryFilterPipe } from 'src/app/pipes/category-filter.pipe';
import { SubCategoryFilterPipe } from 'src/app/pipes/sub-category-filter.pipe';
import { LoggingService } from 'src/app/services/logging.service';
import { ReferralPageComponent } from './referral.page';

describe('ReferralPageComponent', () => {
  let component: ReferralPageComponent;
  let fixture: ComponentFixture<ReferralPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReferralPageComponent,
        SubCategoryComponent,
        OfferComponent,
        CategoryFilterPipe,
        SubCategoryFilterPipe,
      ],
      imports: [RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
    const listItems = fixture.debugElement.nativeElement.querySelectorAll(
      'li:not([aria-hidden])',
    );

    expect(listItems.length).toEqual(1);
  });
});
