import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoggingService } from 'src/app/services/logging.service';

import { TranslationOptionsComponent } from './translation-options.component';

describe('TranslationOptionsComponent', () => {
  let component: TranslationOptionsComponent;
  let fixture: ComponentFixture<TranslationOptionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        RouterTestingModule,
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
    component.localeAlternatives = testLanguageSets;
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
