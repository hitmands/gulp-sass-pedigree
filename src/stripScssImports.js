export function stripScssImports(textContent) {

  return (
    // TODO: Handle comments //@import ""; or /* @import ""; */
    textContent.match(/(?:@import\s+)([^;]*)/g) || []
  )
    .reduce((res, filename) => res.concat(
      filename
        .replace(/@import/, '')
        .replace(/["']/g, '')
        .trim()
        .split(/,\s*/)
        .map(p => `${p.replace(/\.scss$/, '')}.scss`)
      )
      , [])
    ;
}
