import { beforeEach, describe, expect, it, vi } from 'vitest';
import { provideLocationMocks } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { LoggingService } from 'src/app/services/logging.service';

import { TranslationOptionsComponent } from './translation-options.component';

describe('TranslationOptionsComponent', () => {
  let component: TranslationOptionsComponent;
  let fixture: ComponentFixture<TranslationOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'second', component: TranslationOptionsComponent },
        ]),
        provideLocationMocks(),
        {
          provide: LoggingService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TranslationOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updates language links after a navigation event', async () => {
    const currentUrl = vi
      .spyOn(component, 'getCurrentUrl')
      .mockReturnValue('https://example.org/first');
    fixture.componentRef.setInput('localeAlternatives', [
      { key: 'nl', label: 'Nederlands' },
    ]);
    fixture.componentRef.setInput('sourceLanguage', 'en');
    await fixture.whenStable();

    const link = fixture.nativeElement.querySelector('li a');
    expect(link.href).toContain('example.org/first');

    currentUrl.mockReturnValue('https://example.org/second');
    await TestBed.inject(Router).navigateByUrl('/second');
    await fixture.whenStable();

    expect(link.href).toContain('example.org/second');
  });

  it('should contain a link for each Language-alternative', () => {
    // Arrange
    const testLanguageSets = [
      { key: 'nl', label: 'Nederlands' },
      { key: 'fr', label: 'Français' },
    ];
    fixture.componentRef.setInput('localeAlternatives', testLanguageSets);
    fixture.componentRef.setInput('sourceLanguage', 'en');

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
    fixture.componentRef.setInput('localeAlternatives', testLanguageSets);
    fixture.componentRef.setInput('sourceLanguage', 'nl');
    const testLanguageLinkCount = 3;

    // Act
    fixture.detectChanges();

    // Assert
    const linkItems =
      fixture.debugElement.nativeElement.querySelectorAll('li a');

    expect(linkItems.length).toBe(testLanguageLinkCount);
  });
});
