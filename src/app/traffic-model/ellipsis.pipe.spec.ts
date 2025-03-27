import { EllipsisPipe } from './ellipsis.pipe';

/**
 * Tests for the ellipsis pipe.
 */
describe('EllipsisPipe', () => {
  let pipe: EllipsisPipe;

  beforeEach(() => {
    pipe = new EllipsisPipe();
  });

  it('should truncate the string and append ellipsis if it exceeds the limit', () => {
    const result = pipe.transform('This is a long string that needs to be truncated', 20);
    expect(result).toBe('This is a long strin...');
  });

  it('should return the original string if it does not exceed the limit', () => {
    const result = pipe.transform('Short string', 20);
    expect(result).toBe('Short string');
  });

  it('should use the default limit of 100 if no limit is provided', () => {
    const longString = 'a'.repeat(150);
    const result = pipe.transform(longString);
    expect(result).toBe('a'.repeat(100) + '...');
  });

  it('should use the provided ellipsis string', () => {
    const result = pipe.transform('This is a long string that needs to be truncated', 20, '***');
    expect(result).toBe('This is a long strin***');
  });

  it('should return the original string if the limit is equal to the string length', () => {
    const result = pipe.transform('Exact length', 12);
    expect(result).toBe('Exact length');
  });
});
