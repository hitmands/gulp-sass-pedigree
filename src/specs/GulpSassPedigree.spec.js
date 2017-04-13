import * as gulpSassPedigree from '../GulpSassPedigree';
import {DependenciesGraph} from '../DependenciesGraph';
import path from 'path';
import gutil from 'gulp-util';

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

  it('plugin instance should have graph, study, getAncestors properties', () => {
    let plugin = gulpSassPedigree.create();

    expect(plugin.graph).toBeInstanceOf(DependenciesGraph);
    expect(plugin.getAncestors).toEqual(jasmine.any(Function));
    expect(plugin.study).toEqual(jasmine.any(Function));
  });
});

describe('GulpSassPedigree.{study,getAncestors}', () => {
  let scss, pedigree, graph;

  beforeEach(() => {
    scss = [
      {contents: new Buffer(`@import "b";`), path: path.resolve('a.scss')},
      {contents: new Buffer(`@import "c";`), path: path.resolve('b.scss')},
      {contents: new Buffer(`@import "d";`), path: path.resolve('c.scss')},
      {contents: new Buffer(`.thing { color: green; }`), path: path.resolve('d.scss')},
      {contents: null, path: path.resolve('e.scss')}
    ].map(f => new gutil.File(Object.assign(f, {base: path.dirname(f.path)})));

    pedigree = gulpSassPedigree.create();
    graph = pedigree.graph;

    spyOn(graph, 'fileExists').and.returnValue(true);
    scss.forEach(f => pedigree.study()._transform(f, 'utf-8', () => {}));
  });

  it('should create a project graph', () => {
    expect(graph.length).toBe(4);

    expect(graph.get(scss[0].path).parents.length).toBe(0);
    expect(graph.get(scss[0].path).children).toContain(scss[1].path);
    expect(graph.get(scss[1].path).children).toContain(scss[2].path);
    expect(graph.get(scss[2].path).children).toContain(scss[3].path);

    expect(graph.get(scss[1].path).parents).toContain(scss[0].path);
    expect(graph.get(scss[2].path).parents).toContain(scss[1].path);
    expect(graph.get(scss[3].path).parents).toContain(scss[2].path);
    expect(graph.get(scss[3].path).children.length).toBe(0);
  });

  it('should return a.scss', () => {
    // let s = pedigree.getAncestors()._transform(scss[3], 'utf-8', () => {});
    // console.log(scss[3]);
  });
});
