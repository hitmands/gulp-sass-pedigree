export function prune(arr) {
  return arr.filter((child, i, list) => child && i === list.lastIndexOf(child));
}
