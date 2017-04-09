# gulp-sass-pedigree
Incremental Caching System for Gulp and NodeSass

## Getting Started
`npm install --save-dev gulp-sass-pedigree`

## gulpfile
```javascript

const gulp = require('gulp');
const sass = require('gulp-sass');
const {createPedigree, getAncestors} = require('gulp-sass-pedigree');

gulp.task('sass:all', () => {
  return gulp
    .src('path/to/**/*.scss')
    .pipe(createPedigree())
    .pipe(sass())
    .pipe(gulp.dest('./dist'))
  ;
});

gulp.task('sass:watch', ['sass:all'], () => {
  
  return gulp
    .watch('path/to/**/*.scss', event => {
      
      return gulp
        .src(event.path)
        .pipe(getAncestors())    
        .pipe(sass())
        .pipe(gulp.dest('./dist'))
      ;
    })
  ;
});

```
