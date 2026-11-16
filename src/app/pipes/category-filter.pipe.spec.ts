import { describe, expect, it } from 'vitest';
import { CategoryFilterPipe } from './category-filter.pipe';

describe('CategoryFilterPipe', () => {
  it('create an instance', () => {
    const pipe = new CategoryFilterPipe();

    expect(pipe).toBeTruthy();
  });
});
