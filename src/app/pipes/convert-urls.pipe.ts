import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import * as LinkifyIt from 'linkify-it';

@Pipe({
  name: 'convertUrls',
  pure: true,
})
export class ConvertUrlsPipe implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) {}

  transform(value: string): string {
    const linkifyIt = LinkifyIt().add('ftp:', null);
    const allLinks = linkifyIt.match(value);

    if (!allLinks) {
      return value;
    }

    let htmlValue = value;

    // Walk over all links 'backwards', as the replacement value will change the position/index of the original values
    allLinks.reverse().forEach((link) => {
      htmlValue =
        htmlValue.substring(0, link.index) +
        `<a href="${link.url}" target="_blank" rel="noopener noreferrer" class="text-style--inline-link">${link.text}</a>` +
        htmlValue.substring(link.lastIndex);
    });

    return this.domSanitizer.sanitize(SecurityContext.HTML, htmlValue);
  }
}
