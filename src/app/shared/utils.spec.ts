import { getDateFromString } from './utils';

describe('Utils - getDateFromString', () => {
  it('should return a Date for valid strings', () => {
    const testValues = ['1970-01-01', '2000-12-31', '2020-02-29'];
    const testOutputs = [
      new Date('1970-01-01T00:00:00.000Z'),
      new Date('2000-12-31T00:00:00.000Z'),
      new Date('2020-02-29T00:00:00.000Z'),
    ];

    testValues.forEach((value, index) => {
      const output = getDateFromString(value);
      expect(output).toEqual(testOutputs[index]);
    });
  });

  it('should return null for invalid strings', () => {
    const testValues = [
      '1970-31-01',
      '2000-13-31',
      '2022-02-29',
      '1-1-2001',
      '2000-5-31',
      '2000-04-1',
      '2000/01/01',
      '20001231',
    ];

    testValues.forEach((value) => {
      const output = getDateFromString(value);
      expect(output).toBeNull();
    });
  });
});
