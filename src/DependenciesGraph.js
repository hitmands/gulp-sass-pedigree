import path from 'path';
import fs from 'fs';
import {prune} from './Helpers';
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
  }

  get length() {

    return Object.keys(this.cache).length;
  }

  get(path) {

    return this.cache[path];
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

  onFileChange(file, content, dir) {
    let imports = this.updateKeys(stripScssImports(content), dir);

    if(!this.cache[file.path]) {
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



  updateKeys(files, dirs) {

    return files
      .map(filename => {
        for(let i = 0; i < dirs.length; i++) {
          let dir = dirs[i];
          let a = path.resolve(dir, filename);
          let b = a.replace(/([^/\\]*$)/, '_$1');

          if(a in this.cache) {

            return a;
          }

          if(b in this.cache) {

            return b;
          }

          if(fs.existsSync(a)) {
            this.cache[a] = DependenciesGraph.createStack();

            return a;
          }

          if(fs.existsSync(b)) {
            this.cache[b] = DependenciesGraph.createStack();

            return b;
          }
        }
      }, [])
      ;
  }
}
