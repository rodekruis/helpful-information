import { TestBed } from '@angular/core/testing';
import { mockQASet1, mockQASet2with1SubQuestion } from '../mocks/q-a-set.mock';
import { QASet } from '../models/qa-set.model';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a safe query, when any query is provided', () => {
    // Arrange
    const testQueries = [
      '',
      '1',
      'test',
      'unsafe?',
      'un([a-z]+)e!',
      '?test',
      '   test   test  ',
      'test.test',
    ];
    const resultQueries = [
      '',
      '',
      'test',
      'unsafe',
      'un a-z e!',
      'test',
      'test test',
      'test.test',
    ];

    // Act
    testQueries.forEach((testQuery, index: number) => {
      const result = service.sanitizeSearchQuery(testQuery);

      // Assert
      expect(result).toEqual(resultQueries[index]);
    });
  });

  it('should return no results, when empty source is provided', () => {
    // Arrange
    const testQuery = 'test';
    const source: QASet[] = [];

    // Act
    service.setSource(source);
    const result = service.query(testQuery);

    // Assert
    expect(result).toEqual([]);
  });

  it('should return no results, when no query is provided', () => {
    // Arrange
    const testQuery = '';
    const source = [mockQASet1];

    // Act
    service.setSource(source);
    const result = service.query(testQuery);

    // Assert
    expect(result).toEqual([]);
  });

  it('should return results, when query matches text of question', () => {
    // Arrange
    const testQuery = 'test-question';
    const testMatch = {
      ...mockQASet1,
      question: 'test-question 1',
    };
    const source = [mockQASet1, mockQASet2with1SubQuestion, testMatch];

    // Act
    service.setSource(source);
    const result = service.query(testQuery);

    // Assert
    expect(result).toEqual([testMatch]);
    expect(result.length).toBe(1);
  });

  it('should return results, when query matches text of answer', () => {
    // Arrange
    const testQuery = 'test-answer';
    const testMatch = {
      ...mockQASet1,
      answer: 'test-answer 1',
    };
    const source = [mockQASet1, mockQASet2with1SubQuestion, testMatch];

    // Act
    service.setSource(source);
    const result = service.query(testQuery);

    // Assert
    expect(result).toEqual([testMatch]);
    expect(result.length).toBe(1);
  });

  it('should return results, when query matches text of answer regardless of upper/lowercase', () => {
    // Arrange
    const testQuery = 'Test-ANSWER';
    const testMatch1 = {
      ...mockQASet1,
      answer: 'test-answer 1',
    };
    const testMatch2 = {
      ...mockQASet1,
      answer: 'TEST-ANSWER 2',
    };
    const source = [
      mockQASet1,
      mockQASet2with1SubQuestion,
      testMatch1,
      testMatch2,
    ];

    // Act
    service.setSource(source);
    const result = service.query(testQuery);

    // Assert
    expect(result).toEqual([testMatch1, testMatch2]);
    expect(result.length).toBe(2);
  });

  it('should return results, when separate keywords in query match text of answer', () => {
    // Arrange
    const testQuery = 'keyword-X keyword-B';
    const testMatch1 = {
      ...mockQASet1,
      answer: 'keyword-X keyword-Y keyword-Z',
    };
    const testMatch2 = {
      ...mockQASet1,
      answer: 'keyword-A keyword-B keyword-C',
    };
    const testMatch3 = {
      ...mockQASet1,
      answer: 'keyword-A keyword-B keyword-X',
    };
    const source = [
      mockQASet1,
      {
        ...mockQASet1,
        answer: 'keyword-1 keyword-2 keyword-3',
      },
      testMatch1,
      testMatch2,
      testMatch3,
    ];

    // Act
    service.setSource(source);
    const result = service.query(testQuery);

    // Assert
    expect(result).toEqual([testMatch1, testMatch2, testMatch3]);
    expect(result.length).toBe(3);
  });

  it('should return results, when double-quoted string in query matches exact text of answer', () => {
    // Arrange
    const testQuery = 'test-keyword-1 "keyword-B keyword-C" test-keyword-3';
    const testMatch1 = {
      ...mockQASet1,
      answer: 'keyword-A keyword-B keyword-C',
    };
    const source = [
      mockQASet1,
      testMatch1,
      {
        ...mockQASet1,
        answer: 'keyword-C keyword-B keyword-A',
      },
    ];

    // Act
    service.setSource(source);
    const result = service.query(testQuery);

    // Assert
    expect(result).toEqual([testMatch1]);
    expect(result.length).toBe(1);
  });
});
