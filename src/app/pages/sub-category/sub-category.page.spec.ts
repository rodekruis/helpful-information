import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ngxMarkdownModuleFactory } from 'src/app/app.module';
import { LoggingService } from 'src/app/services/logging.service';
import SubCategoryPageComponent from './sub-category.page';

describe('SubCategoryPageComponent', () => {
  let component: SubCategoryPageComponent;
  let fixture: ComponentFixture<SubCategoryPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ngxMarkdownModuleFactory()],
      providers: [
        {
          provide: LoggingService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SubCategoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
