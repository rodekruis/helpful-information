import { Injectable } from '@angular/core';
import type { QASet } from 'src/app/models/qa-set.model';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private source: QASet[] = [];

  constructor() {}

  public setSource(source: QASet[]): void {
    if (!source) {
      console.warn('SearchService: no (valid) source provided');
      return;
    }

    this.source = source;
  }

  public query(rawQuery: string): QASet[] {
    let results: QASet[] = [];
    let safeQuery = this.sanitizeSearchQuery(rawQuery);
    safeQuery = safeQuery.replaceAll('.', '\\.'); // Escape the actual "." character to use as-is

    if (!this.source || !safeQuery) {
      return results;
    }

    const queryParts = safeQuery
      .split(/\s|(?<quoted_group>"[^"]*")/) // Split on spaces, but ignore spaces inside double-quote pairs. See: https://jex.im/regulex/
      .map((keyword) => (keyword ? keyword.replaceAll('"', '') : '').trim()) // Remove double-quotes
      .filter((keyword) => !!keyword); // Remove (now) empty keywords

    results = this.getQAsMatchingToQuery({ queryParts });

    results = this.removeHiddenQAsFromSearchResults({ results });

    return results;
  }

  private getQAsMatchingToQuery({
    queryParts,
  }: {
    queryParts: string[];
  }): QASet[] {
    return this.source.filter((item) => {
      const isMatch = queryParts.some((keyWord) => {
        const regEx = new RegExp(keyWord, 'i');
        return regEx.test(item.question) || regEx.test(item.answer);
      });
      return isMatch ? item : false;
    });
  }

  private removeHiddenQAsFromSearchResults({
    results,
  }: {
    results: QASet[];
  }): QASet[] {
    return results.filter((result) => {
      if (!result.parentSlug) {
        return result.isVisible;
      }

      const parent = this.source.find((qa) => qa.slug === result.parentSlug);
      if (!parent) {
        return true;
      }

      return parent.isVisible;
    });
  }

  public sanitizeSearchQuery(rawValue: string): string {
    if (!rawValue) {
      return '';
    }

    // Remove special RegEx characters: (except the ".")
    let safeValue = rawValue.replaceAll(/[$()*+?[\\\]^{|}]/g, ' ').trim();
    // Collapse all whitespace-characters into 1 space
    safeValue = safeValue.replaceAll(/\s+/g, ' ');

    return safeValue && safeValue.length > 1 ? safeValue : '';
  }
}
