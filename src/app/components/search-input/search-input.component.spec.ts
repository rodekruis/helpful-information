import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SearchInputComponent } from './search-input.component';

describe('SearchInputComponent', () => {
  let component: SearchInputComponent;
  let fixture: ComponentFixture<SearchInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SearchInputComponent],
      imports: [IonicModule.forRoot(), FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchInputComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should use the provided label for the submit-button', () => {
    const testText = 'TEST';
    component.actionLabel = testText;

    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector(
      'button[type=submit]',
    );

    expect(submitButton.textContent).toContain(testText);
  });

  it('should use the fallback-text as label for the submit-button', () => {
    const fallbackText = 'Search';
    component.actionLabel = null;

    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector(
      'button[type=submit]',
    );

    expect(submitButton.textContent).toContain(fallbackText);
  });

  it('should use the provided query as value for the input-field', async () => {
    const testQuery = 'TEST';
    component.searchQuery = testQuery;

    fixture.detectChanges();
    await fixture.whenStable();

    const inputField =
      fixture.nativeElement.querySelector('input[type=search]');

    expect(inputField.value).toBe(testQuery);
  });
});
