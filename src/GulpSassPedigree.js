import through from 'through2';
import path from 'path';
import fs from 'fs';
import gutil from 'gulp-util';

import {DependenciesGraph} from './DependenciesGraph';
import {log} from './Helpers';

export const PLUGIN_NAME = 'gulp-sass-pedigree';


export function create(options = {}) {
  const graph = new DependenciesGraph();
  graph.options = options;
  graph.options.verbose = !!graph.options.verbose;

  return {
    graph,

    study() {

      function studyProjectStructure(file, enc, cb) {

        if(file && !file.isNull()) {
          let dir = path.dirname(file.path);
          let dirs = [dir];
          if(path.relative(dir, file.base)) {
            dirs.push(file.base);
          }
          void graph.onFileChange(
            file,
            file.contents.toString(),
            dirs.concat(graph.options.includePaths)
          );
        }

        return cb(null, file);
      }

      return through.obj(studyProjectStructure);
    },

    getAncestors() {
      function getAncestorsFromFile(file, enc, cb) {
        let start = Date.now();

        if(!file || file.isNull()) {
          return cb(null, file);
        }

        let dir = path.dirname(file.path);
        let dirs = [dir];
        if(path.relative(dir, file.base)) {
          dirs.push(file.base);
        }
        void graph.onFileChange(
          file,
          file.contents.toString(),
          dirs
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
                  contents: file.type === 'stream'
                    ? fs.createReadStream(p) : fs.readFileSync(p)
                })
              );
            })
          ;

          let origin = gutil.colors.green(JSON.stringify(path.basename(file.path)));
          let info = [
            `${gutil.colors.green(ancestors.length)} ancestors for ${origin}`
          ];

          if(graph.options.verbose) {
            info.push(gutil.colors.green(JSON.stringify(ancestors, null, 2)));
          }

          log('info',
            ...info,
            gutil.colors.magenta(`${Date.now() - start} ms`)
          );
        }

        return cb(null, file);
      }

      return through.obj(getAncestorsFromFile);
    }
  };
}
