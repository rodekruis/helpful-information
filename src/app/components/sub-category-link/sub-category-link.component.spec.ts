import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggingService } from 'src/app/services/logging.service';

import { SubCategoryLinkComponent } from './sub-category-link.component';

describe('SubCategoryLinkComponent', () => {
  let component: SubCategoryLinkComponent;
  let fixture: ComponentFixture<SubCategoryLinkComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, SubCategoryLinkComponent],
      providers: [
        {
          provide: LoggingService,
          useValue: null,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SubCategoryLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
