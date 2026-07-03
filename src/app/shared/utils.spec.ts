import {
  createKeyValueList,
  fillTemplateWithUrl,
  formatPhoneNumberAsUrl,
  getDateFromString,
  getFullUrl,
  slugify,
} from './utils';

describe('Utils - getFullUrl', () => {
  it('should return a full URL for valid values', () => {
    // Arrange
    const testValues = [
      'http://example.org',
      'https://example.org',
      'example.org',
      'test.example.org',
      '1234567',
    ];
    const testOutputs = [
      'http://example.org',
      'https://example.org',
      'https://example.org',
      'https://test.example.org',
      'https://1234567',
    ];

    testValues.forEach((value, index) => {
      // Act
      const output = getFullUrl(value);

      // Assert
      expect(output).toEqual(testOutputs[index]);
    });
  });

  it('should return unchanged for invalid URLs/values', () => {
    // Arrange
    const testValues = ['', '123456', 'test', 'x.test', undefined, null];

    testValues.forEach((value, index) => {
      // Act
      const output = getFullUrl(value);

      // Assert
      expect(output).toEqual(testValues[index]);
    });
  });
});

describe('Utils - getDateFromString', () => {
  it('should return a Date for valid strings', () => {
    // Arrange
    const testValues = [
      '1955-11-05',
      '1970-01-01',
      '2000-12-31',
      '2015-11-26',
      '2020-02-29',
      '2035-04-05',
    ];
    const testOutputs = [
      new Date('1955-11-05T00:00:00.000Z'),
      new Date('1970-01-01T00:00:00.000Z'),
      new Date('2000-12-31T00:00:00.000Z'),
      new Date('2015-11-26T00:00:00.000Z'),
      new Date('2020-02-29T00:00:00.000Z'),
      new Date('2035-04-05T00:00:00.000Z'),
    ];

    testValues.forEach((value, index) => {
      // Act
      const output = getDateFromString(value);

      // Assert
      expect(output).toEqual(testOutputs[index]);
    });
  });

  it('should return null for invalid strings', () => {
    // Arrange
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
      // Act
      const output = getDateFromString(value);

      // Assert
      expect(output).toBeNull();
    });
  });
});

describe('Utils - formatPhoneNumberAsUrl', () => {
  it('should return a tel-URL for each input-value', () => {
    // Arrange
    const testValues = [
      '1234567890',
      '+1234567890',
      '123 456 78 90',
      '(123) (45) 67890 1234567890',
      '123456 or 9876543',
      '123456(0987654321 for mobile)',
      'WhatsApp: 1234567890 Signal: 0987654321',
      '',
      'none',
      'nr 2',
      '- 1234567890 - 0987654321',
    ];
    const testOutputs = [
      'tel:1234567890',
      'tel:+1234567890',
      'tel:1234567890',
      'tel:12345678901234567890',
      'tel:123456',
      'tel:1234560987654321',
      'tel:1234567890',
      'tel:',
      'tel:',
      'tel:2',
      'tel:12345678900987654321',
    ];

    testValues.forEach((value, index) => {
      // Act
      const output = formatPhoneNumberAsUrl(value);

      // Assert
      expect(output).toEqual(testOutputs[index]);
    });
  });
});

describe('Utils - fillTemplateWithUrl', () => {
  it('should return a URL with the parameter replaced (when applicable)', () => {
    // Arrange
    const tests = [
      {
        template: 'https://example.org/contact',
        url: 'https://example.org/content-page',
        output: 'https://example.org/contact',
      },
      {
        template:
          'https://example.org/contact-form?text=Feedback+on+URL:+{URL}',
        url: 'https://example.org/content-page/a',
        output:
          'https://example.org/contact-form?text=Feedback+on+URL:+https%3A%2F%2Fexample.org%2Fcontent-page%2Fa',
      },
      {
        template: 'mailto:contact@example.org',
        url: 'https://example.org/content-page',
        output: 'mailto:contact@example.org',
      },
      {
        template: 'mailto:contact@example.org?subject=Feedback+on+URL:+{URL}',
        url: 'https://example.org/content-page/a/b',
        output:
          'mailto:contact@example.org?subject=Feedback+on+URL:+https%3A%2F%2Fexample.org%2Fcontent-page%2Fa%2Fb',
      },
      {
        template: 'mailto:contact@example.org?subject=Feedback&body={URL}',
        url: 'https://example.org/content-page/a/b/c',
        output:
          'mailto:contact@example.org?subject=Feedback&body=https%3A%2F%2Fexample.org%2Fcontent-page%2Fa%2Fb%2Fc',
      },
      {
        template: 'noop',
        url: 'https://example.org/content-page',
        output: 'noop',
      },
      {
        template: '{URL}',
        url: 'https://example.org/content-page',
        output: 'https%3A%2F%2Fexample.org%2Fcontent-page',
      },
      {
        template:
          'mailto:contact@example.org?subject=Feedback+on:+{URL}&body=Feedback+on:+{URL}',
        url: 'https://example.org/content-page',
        output:
          'mailto:contact@example.org?subject=Feedback+on:+https%3A%2F%2Fexample.org%2Fcontent-page&body=Feedback+on:+https%3A%2F%2Fexample.org%2Fcontent-page',
      },
    ];

    tests.forEach((testParams) => {
      // Act
      const output = fillTemplateWithUrl(testParams.template, testParams.url);

      // Assert
      expect(output).toEqual(testParams.output);
    });
  });
});

describe('Utils - slugify', () => {
  it('should return the slug-variant for all valid values', () => {
    // Arrange
    const testValues = [
      '',
      'example slug',
      'Slug With Capitals',
      'Dashed-Slug',
      'Underscores_Allowed',
      '-too-many--dashes-',
      '-',
      '---',
      'Slug nr. 1',
      'Slug: Special ✨ Characters Unit',
    ];
    const testOutputs = [
      '',
      'example-slug',
      'slug-with-capitals',
      'dashed-slug',
      'underscores_allowed',
      'too-many-dashes',
      '',
      '',
      'slug-nr-1',
      'slug-special-characters-unit',
    ];

    testValues.forEach((value, index) => {
      // Act
      const output = slugify(value);

      // Assert
      expect(output).toEqual(testOutputs[index]);
    });
  });
});

describe('Utils - createKeyValueList', () => {
  it('should return a plain string of all properties combined', () => {
    // Arrange
    const tests = [
      {
        properties: {},
        output: '',
      },
      {
        properties: { a: 'valueA', b: 'valueB' },
        output: 'a=valueA;b=valueB',
      },
      {
        properties: {
          a: 'value',
          b: '2',
          c: true,
          d: 3.5,
          e: ['x', 'y', 'z'],
          f: [1, 2, 3],
          g: new Array(),
          h: '',
          // i: null,
          // j: undefined,
          k: 0,
          l: ' ',
          m: ['single'],
          n: [42],
          o: [' '],
        },
        output:
          'a=value;b=2;c=true;d=3.5;e=x,y,z;f=1,2,3;g=;h=;k=0;l=;m=single;n=42;o=',
      },
    ];

    tests.forEach((testParams) => {
      // Act
      const output = createKeyValueList(testParams.properties);

      // Assert
      expect(output).toEqual(testParams.output);
    });
  });
});
