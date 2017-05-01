import path from 'path';
import {prune, fileExists, green, log as logger} from './Helpers';
import {stripScssImports} from './stripScssImports';

export class DependenciesGraph {
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
  has(path) {

    return path in this.cache;
  }
  set(path, children = [], parents = []) {
    this.cache[path] = Object.assign(Object.create(null), {children, parents});
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

    this.has(file.path) || this.set(file.path);
    this.get(file.path).children = imports;
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

            if(this.has(p)) {
              return res.concat(p);
            }

            if(this.fileExists(p)) {
              this.set(p);
              return res.concat(p);
            }
          }
        }

        let log = (...args) => green(JSON.stringify(...args));
        this.log(
          'warn',
          `${log(filename)} not found in ${log(dirs, null, 2)} of ${
              log(path.basename(importer))
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
    let parents = this.get(p).parents;

    return parents.length
      ? this.ascend(list.concat(parents), res)
      : this.ascend(list, res.concat(p))
      ;
  }
}
