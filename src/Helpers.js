import fs from 'fs';

export function prune(arr) {
  return arr.filter((child, i, list) => child && i === list.lastIndexOf(child));
}

export function fileExists(path) {
  return fs.existsSync(path);
}
