import {stripScssImports} from '../stripScssImports';

describe('stripScssImports', () => {

  it('should work with strings and return an Array', () => {
    expect(stripScssImports('')).toBeInstanceOf(Array);
  });

  it('should handle partials and long paths', () => {
    let css = `
  @import '_partial';
  @import 'long/path/to/sass/file/_partial';
`;

    expect(
      stripScssImports(css)
    ).toEqual(['_partial.scss', 'long/path/to/sass/file/_partial.scss']);
  });

  it('should handle the import word', () => {
    let css = `
  @import '_import.scss';
  @import 'import.scss';
  @import 'import/path/to/sass/file/_partial';
  @import 'path/to/sass/file/import/_partial.scss';
  @import 'path/to/sass/file/_partial/import.scss';
`;

    expect(
      stripScssImports(css)
    ).toEqual([
      '_import.scss', 'import.scss', 'import/path/to/sass/file/_partial.scss',
      'path/to/sass/file/import/_partial.scss', 'path/to/sass/file/_partial/import.scss'
    ]);
  });

  it('should handle double and single quotes', () => {
    let css = `
  @import '_partial';
  @import "long/path/to/sass/file/_partial";
`;

    expect(
      stripScssImports(css)
    ).toEqual(['_partial.scss', 'long/path/to/sass/file/_partial.scss']);
  });

  it('should work with first level imports', () => {
    let css = `@import 'foo';@import 'baz';@import 'foobaz';`;

    expect(
      stripScssImports(css)
    ).toEqual(['foo.scss', 'baz.scss', 'foobaz.scss']);
  });

  it('should add .scss extension when not provided', () => {
    let css = `@import 'foo'; @import 'baz.scss';`;

    expect(
      stripScssImports(css)
    ).toContain('foo.scss');

    expect(
      stripScssImports(css)
    ).not.toContain('baz.scss.scss');
  });

  it('should work with multiple inline imports', () => {
    let css = `@import 'foo', 'baz', 'foobaz';`;

    expect(
      stripScssImports(css)
    ).toEqual(['foo.scss', 'baz.scss', 'foobaz.scss']);
  });

  it('should work with any level imports', () => {
    let css = `@import 'foo';
    .foo {@import 'baz';}
    .foobaz .baz {@import 'foobaz';}`;

    expect(
      stripScssImports(css)
    ).toEqual(['foo.scss', 'baz.scss', 'foobaz.scss']);
  });

  it('should work with multiple inline imports at any level', () => {
    let css = `.foobaz, .test {@import 'foo', 'baz', 'foobaz';}`;

    expect(
      stripScssImports(css)
    ).toEqual(['foo.scss', 'baz.scss', 'foobaz.scss']);
  });
});
