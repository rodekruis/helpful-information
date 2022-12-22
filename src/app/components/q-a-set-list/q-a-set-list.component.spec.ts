import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  mockQASet1,
  mockQASet2with1SubQuestion,
} from 'src/app/mocks/q-a-set.mock';
import { PageDataFallback } from 'src/app/models/referral-page-data';
import { LoggingService } from 'src/app/services/logging.service';
import { ReferralPageDataService } from 'src/app/services/referral-page-data.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { environment } from 'src/environments/environment';
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
      declarations: [QASetListComponent],
      imports: [SharedModule, RouterTestingModule],
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
          provide: LoggingService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(QASetListComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    const testList = mockList;
    component.list = testList;

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should show a list of Q&As', () => {
    const testList = mockList;
    component.list = testList;

    fixture.detectChanges();

    const listItems = fixture.nativeElement.querySelectorAll('ol > li');

    expect(listItems.length).toBe(testList.length);
  });

  it("should show links to the Q&As' (sub-)category", () => {
    const testList = [mockList[0]];
    component.list = testList;

    fixture.detectChanges();

    const linkItems = fixture.nativeElement.querySelectorAll('a');

    expect(linkItems.length).toBe(2);
    if (environment.useUrlSlugs) {
      expect(linkItems[0].href).toContain(testList[0].categorySlug);
      expect(linkItems[1].href).toContain(
        `${testList[0].categorySlug}/${testList[0].subCategorySlug}`,
      );
    } else {
      expect(linkItems[0].href).toContain(
        `categoryID=${testList[0].categoryID}`,
      );
      expect(linkItems[1].href).toContain(
        `subCategoryID=${testList[0].subCategoryID}`,
      );
    }
  });

  it('should show the "last updated" date INSIDE the question, not OUTSIDE', () => {
    const testQASet = mockQASet1;
    testQASet.dateUpdated = testDate;
    component.list = [testQASet];
    component.showDateUpdatedOutsideQuestion = false;

    fixture.detectChanges();

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
    const testQASet = mockQASet1;
    testQASet.dateUpdated = testDate;
    component.list = [testQASet];
    component.showDateUpdatedOutsideQuestion = true;

    fixture.detectChanges();

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
