import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedbackLinkComponent } from 'src/app/components/feedback-link/feedback-link.component';

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

  it('should show answer-option buttons with provided text-labels', () => {
    // Arrange
    const testLabels = {
      answerPositive: 'Test Ok',
      answerNegative: 'Test Mwah',
    };
    component.labels = testLabels;
    component.template = 'https://example.org/?url={URL}';

    // Act
    fixture.detectChanges();

    // Assert
    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeList,
    );

    expect(buttons.length).not.toBe(0);
    expect(buttons[0].textContent).toContain(testLabels.answerPositive);
    expect(buttons[1].textContent).toContain(testLabels.answerNegative);
  });
});
