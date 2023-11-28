import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedbackLinkComponent } from 'src/app/components/feedback-link/feedback-link.component';
import { RegionDataFallback } from 'src/app/models/region-data';

describe('FeedbackLinkComponent', () => {
  let component: FeedbackLinkComponent;
  let fixture: ComponentFixture<FeedbackLinkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackLinkComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be visible when a "template" is provided', () => {
    // Arrange
    component.template =
      'https://example.org/specific-contact-form?text=Test:%20{URL}';

    // Act
    fixture.detectChanges();

    // Assert
    const link = fixture.nativeElement.querySelector('a[href][rel]');

    expect(link).not.toBeNull();
    expect(link.href).toContain(
      'https://example.org/specific-contact-form?text=Test:%20',
    );
  });

  it('should NOT be visible when a "template" is NOT defined', () => {
    // Arrange
    component.template = undefined;

    // Act
    fixture.detectChanges();

    // Assert
    const link = fixture.nativeElement.querySelector('a[href][rel]');

    expect(link).toBeNull();
  });

  it('should show the "label" provided', () => {
    // Arrange
    const testLabel = 'Test Label';
    component.label = testLabel;
    component.template = 'https://example.org/?url={URL}';

    // Act
    fixture.detectChanges();

    // Assert
    const link = fixture.nativeElement.querySelector('a[href][rel]');

    expect(link).not.toBeNull();
    expect(link.textContent).toBe(testLabel);
  });

  it('should show the fallback-"label" when none is provided', () => {
    // Arrange
    component.template = 'https://example.org/?url={URL}';

    // Act
    fixture.detectChanges();

    // Assert
    const link = fixture.nativeElement.querySelector('a[href][rel]');

    expect(link).not.toBeNull();
    expect(link.textContent).toBe(RegionDataFallback.labelFeedbackCta);
  });
});
