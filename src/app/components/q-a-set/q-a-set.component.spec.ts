import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  mockQASet1,
  mockQASet2with1SubQuestion,
} from 'src/app/mocks/q-a-set.mock';
import { PageDataFallback } from 'src/app/models/referral-page-data';
import { ConvertUrlsPipe } from 'src/app/pipes/convert-urls.pipe';
import { LoggingService } from 'src/app/services/logging.service';
import { ReferralPageDataService } from 'src/app/services/referral-page-data.service';
import { QASetComponent } from './q-a-set.component';

const testDate = new Date('2022-02-22');
const testDateFormatted = "22-02-'22";

describe('QASetComponent', () => {
  let component: QASetComponent;
  let fixture: ComponentFixture<QASetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, ConvertUrlsPipe],
      providers: [
        {
          provide: ReferralPageDataService,
          useValue: {
            data: {
              labelLastUpdated: PageDataFallback.labelLastUpdated,
            },
          },
        },
        {
          provide: ConvertUrlsPipe,
        },
        {
          provide: LoggingService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(QASetComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    component.qaSet = mockQASet1;

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should show a list of sub-questions', () => {
    component.qaSet = mockQASet2with1SubQuestion;

    fixture.detectChanges();

    const subQuestionItems = fixture.nativeElement.querySelectorAll('li');

    expect(subQuestionItems.length).toBe(
      mockQASet2with1SubQuestion.children.length,
    );
  });

  it('should show the "last updated" date', () => {
    const testQASet = mockQASet1;
    testQASet.dateUpdated = testDate;
    component.qaSet = testQASet;

    fixture.detectChanges();

    const timeElements = fixture.nativeElement.querySelectorAll('time');

    expect(timeElements.length).toBe(1);
    expect(timeElements[0].textContent).toContain(testDateFormatted);
  });

  it('should NOT show the "last updated" date, when specified', () => {
    const testQASet = mockQASet1;
    testQASet.dateUpdated = testDate;
    component.qaSet = testQASet;
    component.showParentDateUpdated = false;

    fixture.detectChanges();

    const timeElements = fixture.nativeElement.querySelectorAll('time');

    expect(timeElements.length).toBe(0);
  });

  it('should NOT show the "last updated" date, when no date available', () => {
    const testQASet = mockQASet1;
    testQASet.dateUpdated = null;
    component.qaSet = testQASet;

    fixture.detectChanges();

    const timeElements = fixture.nativeElement.querySelectorAll('time');

    expect(timeElements.length).toBe(0);
  });

  it('should show the "last updated" date of a sub-question', () => {
    const testQASet = mockQASet2with1SubQuestion;
    testQASet.dateUpdated = testDate;
    testQASet.children[0].dateUpdated = testDate;
    component.qaSet = testQASet;

    fixture.detectChanges();

    const timeElements =
      fixture.nativeElement.querySelectorAll('li details time');

    expect(timeElements.length).toBe(1);
    expect(timeElements[0].textContent).toContain(testDateFormatted);
  });

  it('should contain clickable links, when answer contains plain-text (absolute) URL', () => {
    const testQASet = mockQASet1;
    testQASet.answer =
      'Answer with URL: www.example.org Test-link: https://example.net/';
    component.qaSet = testQASet;

    fixture.detectChanges();

    const linkElements = fixture.nativeElement.querySelectorAll(
      'a[rel="noopener noreferrer"]',
    );

    expect(linkElements.length).toBe(2);
    expect(linkElements[0].href).toContain('http://www.example.org/');
    expect(linkElements[1].href).toContain('https://example.net/');
  });
});
