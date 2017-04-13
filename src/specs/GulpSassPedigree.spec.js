import * as gulpSassPedigree from '../GulpSassPedigree';
import {DependenciesGraph} from '../DependenciesGraph';

describe('GulpSassPedigree', () => {

  it('should export its name', () => {
    expect(gulpSassPedigree.PLUGIN_NAME).toBe('gulp-sass-pedigree');
  });

  it('should export a function create', () => {
    expect(gulpSassPedigree.create).toEqual(jasmine.any(Function));
  });

  it('should export a function create', () => {
    expect(gulpSassPedigree.create).toEqual(jasmine.any(Function));
  });

  it('create() should return a plugin instance', () => {
    expect(gulpSassPedigree.create()).toEqual(jasmine.any(Object));
    expect(gulpSassPedigree.create()).not.toBe(gulpSassPedigree.create());
  });

  it('plugin instance should have graph, study, getAncestors properties', () => {
    let plugin = gulpSassPedigree.create();

    expect(plugin.graph).toBeInstanceOf(DependenciesGraph);
    expect(plugin.getAncestors).toEqual(jasmine.any(Function));
    expect(plugin.study).toEqual(jasmine.any(Function));
  });

  it('should expose default options', () => {
    let plugin = gulpSassPedigree.create();

    expect(plugin.graph.options.ext).toBe('.scss');
    expect(plugin.graph.options.verbose).toBe(false);
    expect(plugin.graph.options.includePaths).toEqual(jasmine.any(Array));
  });

  it('should handle non strict options', () => {
    let opts = {
      verbose: false,
      foo: 'baz'
    };
    let plugin = gulpSassPedigree.create(opts);

    expect(plugin.graph.options.foo).toBe('baz');
    expect(plugin.graph.options.verbose).toBe(false);
  });
});
