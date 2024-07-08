import { provideLocationMocks } from '@angular/common/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LoggingService } from 'src/app/services/logging.service';

import { TranslationOptionsComponent } from './translation-options.component';

describe('TranslationOptionsComponent', () => {
  let component: TranslationOptionsComponent;
  let fixture: ComponentFixture<TranslationOptionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        {
          provide: LoggingService,
        },
      ],
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
    component.localeAlternatives = testLanguageSets;
    component.sourceLanguage = 'en';

    // Act
    fixture.detectChanges();

    // Assert
    const linkItems =
      fixture.debugElement.nativeElement.querySelectorAll('li a');

    expect(linkItems.length).toBe(testLanguageSets.length);
  });

  it('should contain a link for each Language-alternative (without duplicates)', () => {
    // Arrange
    const testLanguageSets = [
      { key: 'nl', label: 'Nederlands' },
      { key: 'fr', label: 'Français' },
      { key: 'en', label: 'English' },
      { key: 'nl', label: 'Nederlands (duplicate by accident)' },
    ];
    component.localeAlternatives = testLanguageSets;
    component.sourceLanguage = 'nl';
    const testLanguageLinkCount = 3;

    // Act
    fixture.detectChanges();

    // Assert
    const linkItems =
      fixture.debugElement.nativeElement.querySelectorAll('li a');

    expect(linkItems.length).toBe(testLanguageLinkCount);
  });
});
