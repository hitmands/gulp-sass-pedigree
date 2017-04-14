import path from 'path';
import gutil from 'gulp-util';
import {prune, fileExists, log as logger} from './Helpers';
import {stripScssImports} from './stripScssImports';

export class DependenciesGraph {
  static createStack() {

    return Object.assign(Object.create(null), {children: [], parents: []});
  }
  static updateChildren(oldDeps, newDeps) {

    return prune([].concat(newDeps));
  }

  constructor() {
    this.cache = Object.create(null);
    this._options = Object.assign(Object.create(null), {
      includePaths: [],
      ext: '.scss',
      verbose: false
    });

    this.log = logger;
    this.fileExists = fileExists;
  }

  get(path) {

    return this.cache[path] || null;
  }

  set options(v) {

    this._options = Object.assign(this._options, v || {});
  }
  get options() {

    return this._options;
  }
  get length() {

    return Object.keys(this.cache).length;
  }

  onFileChange(file, content = '', dirs = []) {
    let imports = this.updateKeys(stripScssImports(content), dirs, file.path);

    if(!(file.path in this.cache)) {
      this.cache[file.path] = DependenciesGraph.createStack();
    }

    let record = this.get(file.path);
    record.children = DependenciesGraph.updateChildren(null, imports);

    void this.updateParents();
  }

  updateParents() {
    for(let k in this.cache) {
      // noinspection JSUnfilteredForInLoop
      this.get(k).parents = [];
    }

    for(let k in this.cache) {
      // noinspection JSUnfilteredForInLoop
      this
        .get(k)
        .children
        .forEach(file => {
          let parents = this.get(file).parents;

          // noinspection JSUnfilteredForInLoop
          ~parents.indexOf(k) || parents.push(k);
        })
      ;
    }
  }

  updateKeys(files, dirs, importer) {

    return files
      .reduce((res, filename) => {
        for(let i = 0; i < dirs.length; i++) {
          let a = path.resolve(dirs[i], filename);
          let paths = [a, a.replace(/([^/\\]*$)/, '_$1')];

          for(let j = 0; j < paths.length; j++) {
            let p = paths[j];
            if(p in this.cache) {

              return res.concat(p);
            }

            if(this.fileExists(p)) {
              this.cache[p] = DependenciesGraph.createStack();

              return res.concat(p);
            }
          }
        }

        this.log(
          'warn',
          `${
            gutil.colors.green(JSON.stringify(filename))
            } not found in ${
            gutil.colors.green(JSON.stringify(dirs, null, 2))
            } of ${
            gutil.colors.green(JSON.stringify(path.basename(importer)))
            }`
        );

        return res;
      }, [])
      ;
  }

  ascend(list, res = []) {
    if(!list.length) {
      return prune(res);
    }

    let p = list.shift();
    let dep = this.cache[p];

    return dep.parents.length
      ? this.ascend(list.concat(dep.parents), res)
      : this.ascend(list, res.concat(p))
      ;
  }
}
