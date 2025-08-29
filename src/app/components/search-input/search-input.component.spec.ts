import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SearchInputComponent } from './search-input.component';

describe('SearchInputComponent', () => {
  let component: SearchInputComponent;
  let fixture: ComponentFixture<SearchInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({}).compileComponents();

    fixture = TestBed.createComponent(SearchInputComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    // Arrange
    // Act
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should use the provided label for the submit-button', () => {
    // Arrange
    const testText = 'TEST';
    component.actionLabel = testText;

    // Act
    fixture.detectChanges();

    // Assert
    const submitButton = fixture.nativeElement.querySelector(
      'button[type=submit]',
    );

    expect(submitButton.textContent).toContain(testText);
  });

  it('should use the fallback-text as label for the submit-button', () => {
    // Arrange
    const fallbackText = 'Search';
    component.actionLabel = null;

    // Act
    fixture.detectChanges();

    // Assert
    const submitButton = fixture.nativeElement.querySelector(
      'button[type=submit]',
    );

    expect(submitButton.textContent).toContain(fallbackText);
  });

  it('should use the provided query as value for the input-field', async() => {
    // Arrange
    const testQuery = 'TEST';
    component.searchQuery = testQuery;

    // Act
    fixture.detectChanges();
    await fixture.whenStable();

    // Assert
    const inputField =
      fixture.nativeElement.querySelector('input[type=search]');

    expect(inputField.value).toBe(testQuery);
  });
});
