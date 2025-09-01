import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  mockQASet1,
  mockQASet2with1SubQuestion,
} from 'src/app/mocks/q-a-set.mock';
import { RegionDataFallback } from 'src/app/models/region-data';
import { LoggingService } from 'src/app/services/logging.service';
import { RegionDataService } from 'src/app/services/region-data.service';
import { ngxMarkdownModuleFactory } from 'src/main';

import { QASetComponent } from './q-a-set.component';

const testDate = new Date('2022-02-22');
const testDateFormatted = `22-02-'22`;

describe('QASetComponent', () => {
  let component: QASetComponent;
  let fixture: ComponentFixture<QASetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ngxMarkdownModuleFactory()],
      providers: [
        {
          provide: RegionDataService,
          useValue: {
            data: {
              labelLastUpdated: RegionDataFallback.labelLastUpdated,
            },
          },
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
    // Arrange
    component.qaSet = mockQASet1;

    // Act
    fixture.detectChanges();

    // Assert
    expect(component).toBeTruthy();
  });

  it('should show a list of sub-questions', () => {
    // Arrange
    component.qaSet = mockQASet2with1SubQuestion;

    // Act
    fixture.detectChanges();

    // Assert
    const subQuestionItems = fixture.nativeElement.querySelectorAll('li');

    expect(subQuestionItems.length).toBe(
      mockQASet2with1SubQuestion.children.length,
    );
  });

  it('should show the "last updated" date', () => {
    // Arrange
    const testQASet = mockQASet1;
    testQASet.dateUpdated = testDate;
    component.qaSet = testQASet;

    // Act
    fixture.detectChanges();

    // Assert
    const timeElements = fixture.nativeElement.querySelectorAll('time');

    expect(timeElements.length).toBe(1);
    expect(timeElements[0].textContent).toContain(testDateFormatted);
  });

  it('should NOT show the "last updated" date, when specified', () => {
    // Arrange
    const testQASet = mockQASet1;
    testQASet.dateUpdated = testDate;
    component.qaSet = testQASet;
    component.showParentDateUpdated = false;

    // Act
    fixture.detectChanges();

    // Assert
    const timeElements = fixture.nativeElement.querySelectorAll('time');

    expect(timeElements.length).toBe(0);
  });

  it('should NOT show the "last updated" date, when no date available', () => {
    // Arrange
    const testQASet = mockQASet1;
    testQASet.dateUpdated = null;
    component.qaSet = testQASet;

    // Act
    fixture.detectChanges();

    // Assert
    const timeElements = fixture.nativeElement.querySelectorAll('time');

    expect(timeElements.length).toBe(0);
  });

  it('should show the "last updated" date of a sub-question', () => {
    // Arrange
    const testQASet = mockQASet2with1SubQuestion;
    testQASet.dateUpdated = testDate;
    testQASet.children[0].dateUpdated = testDate;
    component.qaSet = testQASet;

    // Act
    fixture.detectChanges();

    // Assert
    const timeElements =
      fixture.nativeElement.querySelectorAll('li details time');

    expect(timeElements.length).toBe(1);
    expect(timeElements[0].textContent).toContain(testDateFormatted);
  });

  it('should contain clickable links that open a new window, when answer contains plain-text (absolute) URL', waitForAsync(async () => {
    // Arrange
    const testQASet = mockQASet1;
    testQASet.answer =
      'Answer with URL: www.example.org Test-link: https://example.net/';
    component.qaSet = testQASet;

    // Act
    fixture.detectChanges();
    await fixture.whenStable();

    // Assert
    const linkElements = fixture.nativeElement.querySelectorAll('a[href]');

    expect(linkElements.length).toBe(2);
    linkElements.forEach((link: HTMLAnchorElement) => {
      expect(link.href).toMatch(/^http/);
      expect(link.target).toBe('_blank');
      expect(link.rel).toContain('external');
      expect(link.rel).toContain('noreferrer');
      expect(link.rel).toContain('noopener');
      expect(link.rel).toContain('x-plain-url');
    });

    expect(linkElements[0].href).toContain('http://www.example.org/');
    expect(linkElements[1].href).toContain('https://example.net/');
  }));

  it('should contain (safe) clickable links that open a new window, when answer contains HTML-links', waitForAsync(async () => {
    // Arrange
    const testQASet = mockQASet1;
    testQASet.answer =
      'Answer with HTML-link: <a href="http://evil.example.net/">https://innocent.example.org</a>' +
      'Evil link: <a \nhref=//evil.example.net>link</a>' +
      'Evil link: <a\thref= //evil.example.net>link</a>' +
      'Evil link: <a href=//evil.example.net target="_self">link</a>' +
      // 'Evil link: <a target="_self" href="//evil.example.net">link</a>' + // This circumvents the addition of target attribute :(
      // 'Evil link: <a rel="opener" href="//evil.example.net">link</a>' + // This circumvents the addition of rel attribute :(
      '';
    component.qaSet = testQASet;

    // Act
    fixture.detectChanges();
    await fixture.whenStable();

    // Assert
    const linkElements = fixture.nativeElement.querySelectorAll('a[href]');

    expect(linkElements.length).toBe(4);
    linkElements.forEach((link: HTMLAnchorElement) => {
      expect(link.target).toBe('_blank');
      expect(link.rel).toContain('external');
      expect(link.rel).toContain('noreferrer');
      expect(link.rel).toContain('noopener');
      expect(link.rel).not.toContain('x-plain-url');
    });
  }));

  it('should contain clickable links that open in same window, when answer contains local/relative links', waitForAsync(async () => {
    // Arrange
    const testQASet = mockQASet1;
    testQASet.answer =
      'Answer with:\n' +
      'a local HTML-link: <a href= /test>local test</a> \n' +
      'a local Markdown-link: [local test](/test) \n' +
      'an external HTML-link: <a href= https://example.org/test>external test</a> \n' +
      'an external Markdown-link: [external test](https://example.org/test) \n' +
      'a Markdown-link with formatting: [**External** _link_](https://example.org/test)';
    component.qaSet = testQASet;

    // Act
    fixture.detectChanges();
    await fixture.whenStable();

    // Assert
    const linkElements = fixture.nativeElement.querySelectorAll('a[href]');

    expect(linkElements.length).toBe(5);

    expect(linkElements[0].rel).toBe('');
    expect(linkElements[0].target).toBe('');
    expect(linkElements[0].rel).not.toContain('x-plain-url');

    expect(linkElements[1].rel).toBe('');
    expect(linkElements[1].target).toBe('');
    expect(linkElements[1].rel).not.toContain('x-plain-url');

    expect(linkElements[2].rel).toContain('external');
    expect(linkElements[2].rel).not.toContain('x-plain-url');
    expect(linkElements[2].target).toBe('_blank');

    expect(linkElements[3].rel).toContain('external');
    expect(linkElements[3].rel).not.toContain('x-plain-url');
    expect(linkElements[3].target).toBe('_blank');

    expect(linkElements[4].rel).toContain('external');
    expect(linkElements[4].rel).not.toContain('x-plain-url');
    expect(linkElements[4].target).toBe('_blank');
    expect(linkElements[4].innerHTML).toContain(
      '<strong>External</strong> <em>link</em>',
    );
  }));
});
