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
      if(Object.prototype.hasOwnProperty.call(this.cache, k)) {
        this.cache[k].parents = [];
      }
    }

    for(let k in this.cache) {
      if(!Object.prototype.hasOwnProperty.call(this.cache, k)) {
        continue;
      }

      this.cache[k]
        .children
        .forEach(file => {

          if(!~this.cache[file].parents.indexOf(k)) {
            this.cache[file].parents.push(k)
          }
        })
      ;
    }
  }

  updateKeys(files, dir) {

    return files
      .map(filename => {
        let a = path.resolve(dir, filename);

        if(a in this.cache) {

          return a;
        }

        if(fs.existsSync(a)) {
          this.cache[a] = DependenciesGraph.createStack();

          return a;
        }

        let b = a.replace(/(\w+\.scss$)/, '_$1');
        if(b in this.cache) {

          return b;
        }

        if(fs.existsSync(b)) {
          this.cache[b] = DependenciesGraph.createStack();

          return b;
        }

      }, [])
      ;
  }
}
