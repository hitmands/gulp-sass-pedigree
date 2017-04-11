import through from 'through2';
import path from 'path';
import fs from 'fs';
import gutil from 'gulp-util';

import {DependenciesGraph} from './DependenciesGraph';

const graph = new DependenciesGraph();
const PLUGIN_NAME = 'gulp-sass-pedigree';

let options = {
  includePaths: []
};


function sassPedigreeStudy(file, enc, cb) {
  graph.options = options;

  if(file && !file.isNull()) {
    void graph.onFileChange(
      file,
      file.contents.toString(),
      file.base
    );
  }

  return cb(null, file);
}


function sassPedigreeGetAncestors(file, enc, cb) {
  let start = Date.now();

  if(!file || file.isNull()) {
    return cb(null, file);
  }

  void graph.onFileChange(
    file,
    file.contents.toString(),
    file.base
  );

  let parents = graph.get(file.path).parents;

  if(parents.length) {
    let ancestors = graph.ascend(parents.slice());

    ancestors
      .forEach(p => {
        this.push(
          new gutil.File({
            cwd: file.cwd,
            path: p,
            base: path.dirname(p),
            contents: file.type === 'stream' ?
              fs.createReadStream(p) : fs.readFileSync(p)
          })
        );
      })
    ;

    let stats = {
      ancestors: ancestors.length,
      file: file.filename
    };

    gutil.log(
      gutil.colors.bgYellow(
        ` ${PLUGIN_NAME}: ${JSON.stringify(stats)} `
      ),
      gutil.colors.magenta(`${Date.now() - start} ms`)
    );
  }

  return cb(null, file);
}

export function createPedigree(_options) {
  options = Object.assign({}, options, _options);

  return through.obj(sassPedigreeStudy);
}
export function getAncestors() {
  return through.obj(sassPedigreeGetAncestors);
}
