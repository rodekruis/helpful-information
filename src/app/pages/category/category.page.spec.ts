import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { CategoryFilterPipe } from 'src/app/pipes/category-filter.pipe';
import { LoggingService } from 'src/app/services/logging.service';
import { OffersService } from 'src/app/services/offers.service';
import { CategoryPageComponent } from './category.page';

describe('CategoryPageComponent', () => {
  let component: CategoryPageComponent;
  let fixture: ComponentFixture<CategoryPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryFilterPipe],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule,
        CategoryPageComponent,
      ],
      providers: [
        {
          provide: OffersService,
        },
        {
          provide: LoggingService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});