export function stripScssImports(textContent) {

  return (
    // TODO: Handle comments //@import ""; or /* @import ""; */
    textContent.match(/(?:@import\s+)([^;]*)/g) || []
  )
    .reduce((res, filename) => res.concat(
      filename
        .replace(/@import|["'\s]/g, '')
        .split(/,/)
        .map(p => `${p.replace(/\.scss$/, '')}.scss`)
      )
      , [])
    ;
}
