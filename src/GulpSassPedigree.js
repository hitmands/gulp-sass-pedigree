import through from 'through2';
import path from 'path';
import fs from 'fs';
import gutil from 'gulp-util';
import {DependenciesGraph} from './DependenciesGraph';
import {log} from './Helpers';

export const PLUGIN_NAME = 'gulp-sass-pedigree';
const green = msg => gutil.colors.green(msg);
const getFileChangedArgs = (graph, file) => {
  let dir = path.dirname(file.path);
  let dirs = [dir];

  if(path.relative(dir, file.base)) {
    dirs.push(file.base);
  }

  return [
    file, file.contents.toString(), dirs.concat(graph.options.includePaths)
  ];
};

export function create(options = {}) {
  const graph = new DependenciesGraph();
  graph.options = options;
  graph.options.verbose = !!graph.options.verbose;

  return {
    graph,
    study() {

      return through.obj(function studyProjectStructure(file, enc, cb) {
        if(file && !file.isNull()) {
          void graph.onFileChange(...getFileChangedArgs(graph, file));
        }

        return cb(null, file);
      });
    },
    getAncestors() {

      return through.obj(function getAncestorsFromFile(file, enc, cb) {
        if(file && !file.isNull()) {
          let start = Date.now();

          void graph.onFileChange(...getFileChangedArgs(graph, file));
          let parents = graph.get(file.path).parents;

          if(parents.length) {
            let ancestors;

            try {
              ancestors = graph.ascend(parents.slice());
            } catch(e) {

              log('warn',
                `possible circular dependency at ${green(file.path)}`);
              if(graph.options.verbose) {
                log('error', e);
              }
            }

            if(ancestors) {
              for(let i = 0; i < ancestors.length; i++) {
                let p = ancestors[i];

                this.push(
                  /* eslint object-property-newline: 0 */
                  new gutil.File({
                    path: p, cwd: file.cwd, base: path.dirname(p),
                    contents: file.type === 'stream'
                      ? fs.createReadStream(p) : fs.readFileSync(p)
                  })
                );
              }

              let filename = green(JSON.stringify(path.basename(file.path)));
              let info = [
                `${green(ancestors.length)} ancestors for ${filename}`
              ];

              if(graph.options.verbose) {
                info.push(green(JSON.stringify(ancestors, null, 2)));
              }

              log('info', ...info,
                gutil.colors.magenta(`${Date.now() - start} ms`)
              );
            }

          }
        }

        return cb(null, file);
      });
    }
  };
}
