import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BreadcrumbsComponent } from 'src/app/components/breadcrumbs/breadcrumbs.component';
import { QASetComponent } from 'src/app/components/q-a-set/q-a-set.component';
import {
  mockQASet1,
  mockQASet2with1SubQuestion,
} from 'src/app/mocks/q-a-set.mock';
import { RegionDataFallback } from 'src/app/models/region-data';
import { LoggingService } from 'src/app/services/logging.service';
import { RegionDataService } from 'src/app/services/region-data.service';
import { ngxMarkdownModuleFactory } from 'src/main';

import { QASetListComponent } from './q-a-set-list.component';

const testDate = new Date('2022-02-22');
const testDateFormatted = "22-02-'22";

const mockList = [
  {
    ...mockQASet1,
    categoryName: 'Test Category 1',
    subCategoryName: 'Test Sub-Category 1',
  },
  {
    ...mockQASet1,
    id: 12,
    question: 'Test Question A2',
    answer: 'Test Answer A2',
    categoryID: 2,
    categoryName: 'Test Category 2',
    subCategoryID: 2,
    subCategoryName: 'Test Sub-Category 2',
  },
  {
    ...mockQASet2with1SubQuestion,
    categoryName: 'Test Category 1',
    subCategoryName: 'Test Sub-Category 1',
  },
];

describe('QASetListComponent', () => {
  let component: QASetListComponent;
  let fixture: ComponentFixture<QASetListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule,
        BreadcrumbsComponent,
        QASetComponent,
        ngxMarkdownModuleFactory(),
      ],
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

    fixture = TestBed.createComponent(QASetListComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    // Arrange
    const testList = mockList;
    component.list = testList;

    // Act
    fixture.detectChanges();

    // Assert
    expect(component).toBeTruthy();
  });

  it('should show a list of Q&As', () => {
    // Arrange
    const testList = mockList;
    component.list = testList;

    // Act
    fixture.detectChanges();

    // Assert
    const listItems =
      fixture.nativeElement.querySelectorAll('ol[role=list] > li');

    expect(listItems.length).toBe(testList.length);
  });

  it("should show links to the Q&As' (sub-)category", () => {
    // Arrange
    const testList = [mockList[0]];
    component.list = testList;

    // Act
    fixture.detectChanges();

    // Assert
    const linkItems = fixture.nativeElement.querySelectorAll('a');

    expect(linkItems.length).toBe(2);
    expect(linkItems[0].href).toContain(testList[0].categorySlug);
    expect(linkItems[1].href).toContain(
      `${testList[0].categorySlug}/${testList[0].subCategorySlug}`,
    );
  });

  it('should show the "last updated" date INSIDE the question, not OUTSIDE', () => {
    // Arrange
    const testQASet = mockQASet1;
    testQASet.dateUpdated = testDate;
    component.list = [testQASet];
    component.showDateUpdatedOutsideQuestion = false;

    // Act
    fixture.detectChanges();

    // Assert
    const timeElementsInside =
      fixture.nativeElement.querySelectorAll('app-q-a-set time');
    const timeElementsOutside = fixture.nativeElement.querySelectorAll(
      'time:not(app-q-a-set time)',
    );

    expect(timeElementsInside.length).toBe(1);
    expect(timeElementsOutside.length).toBe(0);
    expect(timeElementsInside[0].textContent).toContain(testDateFormatted);
  });

  it('should show the "last updated" date OUTSIDE the question, not INSIDE', () => {
    // Arrange
    const testQASet = mockQASet1;
    testQASet.dateUpdated = testDate;
    component.list = [testQASet];
    component.showDateUpdatedOutsideQuestion = true;

    // Act
    fixture.detectChanges();

    // Assert
    const timeElementsInside =
      fixture.nativeElement.querySelectorAll('app-q-a-set time');
    const timeElementsOutside = fixture.nativeElement.querySelectorAll(
      'time:not(app-q-a-set time)',
    );

    expect(timeElementsInside.length).toBe(0);
    expect(timeElementsOutside.length).toBe(1);
    expect(timeElementsOutside[0].textContent).toContain(testDateFormatted);
  });
});
