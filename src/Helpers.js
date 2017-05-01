import gutil from 'gulp-util';
import fs from 'fs';
import {PLUGIN_NAME} from './GulpSassPedigree';

export function prune(arr) {
  return arr.filter((child, i, list) => child && i === list.lastIndexOf(child));
}

export function fileExists(path) {
  return fs.existsSync(path);
}

export function log(type, ...args) {
  let color;

  switch(type) {
    case 'warn':
      color = 'yellow';
      break;

    case 'error':
      color = 'red';
      break;

    default:
      color = 'cyan';
  }

  return gutil.log(
    gutil.colors[color](`${PLUGIN_NAME}::${type}`), ...args
  );
}

export const green = msg => gutil.colors.green(msg);
