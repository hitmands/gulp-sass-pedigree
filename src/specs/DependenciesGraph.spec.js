import {DependenciesGraph} from '../DependenciesGraph';
import {log} from '../Helpers';
import path from 'path';

describe('DependenciesGraph', () => {
  let graph;
  beforeEach(() => {
    graph = new DependenciesGraph();
  });

  it('should have a log property', () => {

    expect(graph.log).toEqual(jasmine.any(Function));
    expect(graph.log).toBe(log);
  });

  it('should have default options', () => {
    let opts = graph.options;

    expect(opts).toEqual(jasmine.any(Object));
    expect(opts.verbose).toEqual(jasmine.any(Boolean));
    expect(opts.includePaths).toEqual(jasmine.any(Array));
    expect(opts.ext).toEqual(jasmine.any(String));
    expect(opts.ext).toBe('.scss');
  });

  it('should have a bare object property cache', () => {

    expect(graph.cache).toEqual(jasmine.any(Object));
  });

  it('should only extend options while set options', () => {
    let opts = graph.options;
    graph.options = void 0;

    expect(opts).toEqual(jasmine.any(Object));
    expect(opts.verbose).toEqual(jasmine.any(Boolean));
    expect(opts.includePaths).toEqual(jasmine.any(Array));
    expect(opts.ext).toEqual(jasmine.any(String));
    expect(opts.ext).toBe('.scss');
  });

  it('should have a (int) length property', () => {
    expect(graph.length).toEqual(jasmine.any(Number));
    expect(graph.length).toBe(Object.keys(graph.cache).length);
  });

  it('should get a cache value via get()', () => {
    graph.cache.foo = 'baz';
    expect(graph.get('foo')).toBe('baz');
    expect(graph.get('baz')).toBe(null);
  });

  it('fileExists property should be a Function', () => {
    expect(graph.fileExists).toEqual(jasmine.any(Function));
  });

  it('should create the initial cache key stack', () => {
    let stack = DependenciesGraph.createStack();
    expect(stack).toEqual(jasmine.any(Object));
    expect(stack.parents).toEqual(jasmine.any(Array));
    expect(stack.children).toEqual(jasmine.any(Array));
  });

  it('updateChildren should not affect the original array', () => {
    let arr =  [1, 2, 3, 4];
    let children = DependenciesGraph.updateChildren(null, arr);
    expect(children).not.toBe(arr);
    expect(children).toContain(...arr);
  });

  it('updateParents', () => {
    let cache = graph.cache;

    cache.foo = DependenciesGraph.createStack();
    cache.baz = DependenciesGraph.createStack();
    cache._1 = DependenciesGraph.createStack();
    cache._2 = DependenciesGraph.createStack();
    cache._3 = DependenciesGraph.createStack();
    expect(graph.length).toBe(5);

    cache._1.children.push('_2');
    cache._2.children.push('_3');

    cache.foo.children.push('_1');
    cache.baz.children.push('_1');

    void graph.updateParents();

    expect(graph.get('_1').parents).toContain('foo', 'baz');
    expect(graph.get('_2').parents).toContain('_1');
    expect(graph.get('_3').parents).toContain('_2');
  });

  it('ascend should get only first level parents', () => {
    let cache = graph.cache;

    cache.foo = DependenciesGraph.createStack();
    cache.baz = DependenciesGraph.createStack();
    cache._1 = DependenciesGraph.createStack();
    cache._2 = DependenciesGraph.createStack();
    cache._3 = DependenciesGraph.createStack();
    expect(graph.length).toBe(5);

    cache._1.children.push('_2');
    cache._2.children.push('_3');

    cache.foo.children.push('_1');
    cache.baz.children.push('_1');

    void graph.updateParents();

    expect(graph.ascend(['_3'])).toContain('foo', 'baz');
  });
});

describe('DependenciesGraph.updateKeys', () => {
  let graph, files, base, importer, FS;

  beforeEach(() => {
    files = [];
    base = path.join('path', 'to', 'mocked', 'file-system');
    importer = path.join(base, 'src', 'one.scss');
    FS = [];

    graph = new DependenciesGraph();
    graph.fileExists = f => FS.some(p => f === p);
  });

  it('should do not find anything', () => {
    files = ['_1.scss', '_2.scss', '_3.scss'];
    spyOn(graph, 'log');
    graph.updateKeys(files, FS, importer);
    expect(graph.log).toHaveBeenCalledTimes(files.length);
  });

  it('should find a in cache', () => {
    files = ['1.scss'];
    graph.cache[path.resolve(base, files[0])] = DependenciesGraph.createStack();
    graph.updateKeys(files, [base], importer);
  });

  it('should find b (underscored) in cache', () => {
    files = ['1.scss'];
    graph.cache[path.resolve(base, `_${files[0]}`)] = DependenciesGraph.createStack();
    graph.updateKeys(files, [base], importer);
  });

  it('should find b (underscored) in cache', () => {
    FS = ['1.scss', '_2.scss'].map(f => path.resolve(base, f));
    graph.updateKeys(['1.scss', '2.scss'], [base], importer);
  });
});
