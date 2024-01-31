import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TranslationOptionsComponent } from './translation-options.component';

describe('TranslationOptionsComponent', () => {
  let component: TranslationOptionsComponent;
  let fixture: ComponentFixture<TranslationOptionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [],
    }).compileComponents();

    fixture = TestBed.createComponent(TranslationOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a link for each Language-alternative', () => {
    // Arrange
    const testLanguageSets = [
      { key: 'nl', label: 'Nederlands' },
      { key: 'fr', label: 'Français' },
    ];
    component.languageOptions = testLanguageSets;

    // Act
    fixture.detectChanges();

    // Assert
    const listItems =
      fixture.debugElement.nativeElement.querySelectorAll('li a');

    expect(listItems.length).toBe(testLanguageSets.length);
  });

  it('should contain a link for each Language-alternative, that is NOT the default-language', () => {
    // Arrange
    const testLanguageSets = [
      { key: 'nl', label: 'Nederlands' },
      { key: 'fr', label: 'Français' },
      { key: 'en', label: 'English' },
      { key: 'nl', label: 'Nederlands (duplicate by accident)' },
    ];
    component.languageOptions = testLanguageSets;
    component.sourceLanguage = 'nl';
    const testLanguageLinkCount = 2;

    // Act
    fixture.detectChanges();

    // Assert
    const listItems =
      fixture.debugElement.nativeElement.querySelectorAll('li a');

    expect(listItems.length).toBe(testLanguageLinkCount);
  });
});
