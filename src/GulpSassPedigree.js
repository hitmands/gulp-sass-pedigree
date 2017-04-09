import through from 'through2';
import path from 'path';
import fs from 'fs';
import gutil from 'gulp-util';

import {DependenciesGraph} from './DependenciesGraph';

const graph = new DependenciesGraph();

function sassPedigreeStudy(file, enc, cb) {
  if(!file.isNull()) {
    void graph.onFileChange(
      file,
      file.contents.toString(),
      file.base
    );
  }

  return cb(null, file);
}


function sassPedigreeGetAncestors(file, enc, cb) {
  if(file.isNull()) {
    return cb(null, file);
  }

  void graph.onFileChange(
    file,
    file.contents.toString(),
    file.base
  );

  let parents = graph.get(file.path).parents.slice();

  if(!parents.length) {
    return cb(null, file);
  }

  this.push.apply(
    this, graph
      .getParents(parents)
      .map(
        p =>  new gutil.File(

          {
            cwd: file.cwd,
            path: p,
            base: path.dirname(p),
            contents: file.type === 'stream' ?
              fs.createReadStream(p) : fs.readFileSync(p)
          }

        )
    )
  );

  return cb();
}

export function createPedigree() {
  return through.obj(sassPedigreeStudy);
}
export function getAncestors() {
  return through.obj(sassPedigreeGetAncestors);
}
