import { FileSizePipe } from './file-size.pipe';

/**
 * Tests for the file size pipe.
 */
describe('FileSizePipe', () => {
  it('create an instance', () => {
    const pipe = new FileSizePipe();
    expect(pipe).toBeTruthy();
  });

  it('should transform bytes to human-readable format', () => {
    const pipe = new FileSizePipe();
    expect(pipe.transform(500)).toBe('500 B');
    expect(pipe.transform(1500)).toBe('1.5 KB');
    expect(pipe.transform(1500000)).toBe('1.5 MB');
    expect(pipe.transform(1500000000)).toBe('1.5 GB');
  });

  it('should handle edge cases', () => {
    const pipe = new FileSizePipe();
    expect(pipe.transform(0)).toBe('0 B');
    expect(pipe.transform(-500)).toBe('-500 B');
    expect(pipe.transform(999)).toBe('999 B');
    expect(pipe.transform(1000)).toBe('1.0 KB');
  });
});
