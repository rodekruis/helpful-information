import { inject } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { ConvertUrlsPipe } from './convert-urls.pipe';

describe('ConvertUrlsPipe', () => {
  it('create an instance', inject(
    [DomSanitizer],
    (domSanitizer: DomSanitizer) => {
      const pipe = new ConvertUrlsPipe(domSanitizer);
      expect(pipe).toBeTruthy();
    },
  ));

  it('converts text-with-URLs into text-with-HTML-links', inject(
    [DomSanitizer],
    (domSanitizer: DomSanitizer) => {
      const pipe = new ConvertUrlsPipe(domSanitizer);
      const testValues = [
        'A test string with a URL: https://example.org/test ; And other text.',
        '//example.org',
        'www.example.org',
      ];
      const testContainer: HTMLDivElement = document.createElement('div');

      testValues.forEach((testValue) => {
        const output = pipe.transform(testValue);
        testContainer.innerHTML = output;

        const outputLinks = testContainer.querySelectorAll('a');
        expect(outputLinks.length).toBe(1);
        expect(outputLinks[0].target).toBe('_blank');
        expect(outputLinks[0].rel).toContain('noopener');
        expect(outputLinks[0].rel).toContain('noreferrer');
      });
    },
  ));
});
