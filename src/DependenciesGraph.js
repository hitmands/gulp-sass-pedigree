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

  set options(v) {

    this._options = Object.assign(this._options, v || {});
  }
  get options() {

    return this._options;
  }
  get length() {

    return Object.keys(this.cache).length;
  }

  get(path) {

    return this.cache[path] || null;
  }

  ascend(list, res = []) {
    if(!list.length) {
      return prune(res);
    }

    let p = list.shift();
    let dep = this.cache[p];

    return dep.parents.length ?
      this.ascend(list.concat(dep.parents), res) :
      this.ascend(list, res.concat(p))
      ;
  }

  onFileChange(file, content, dirs) {
    let imports = this.updateKeys(stripScssImports(content), dirs, file.path);

    if(!(file.path in this.cache)) {
      this.cache[file.path] = DependenciesGraph.createStack();
    }

    this.cache[file.path].children = DependenciesGraph.updateChildren(
      this.cache[file.path].children, imports
    );

    void this.updateParents();
  }

  updateParents() {
    for(let k in this.cache) {
      //noinspection JSUnfilteredForInLoop
      this.cache[k].parents = [];
    }

    for(let k in this.cache) {
      //noinspection JSUnfilteredForInLoop
      this.cache[k]
        .children
        .forEach(file => {

          //noinspection JSUnfilteredForInLoop
          if(!~this.cache[file].parents.indexOf(k)) {
            //noinspection JSUnfilteredForInLoop
            this.cache[file].parents.push(k);
          }
        })
      ;
    }
  }


  updateKeys(files, dirs, importer) {

    return files
      .reduce((res, filename) => {
        for(let i = 0; i < dirs.length; i++) {
          let dir = dirs[i];
          let a = path.resolve(dir, filename);
          let b = a.replace(/([^/\\]*$)/, '_$1');

          if(a in this.cache) {

            return res.concat(a);
          }

          if(b in this.cache) {

            return res.concat(b);
          }

          if(this.fileExists(a)) {
            this.cache[a] = DependenciesGraph.createStack();

            return res.concat(a);
          }

          if(this.fileExists(b)) {
            this.cache[b] = DependenciesGraph.createStack();

            return res.concat(b);
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
}
