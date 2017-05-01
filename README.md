# gulp-sass-pedigree
[![Build Status](https://travis-ci.org/hitmands/gulp-sass-pedigree.svg?branch=master)](https://travis-ci.org/hitmands/gulp-sass-pedigree) [![Code Climate](https://codeclimate.com/github/hitmands/gulp-sass-pedigree/badges/gpa.svg)](https://codeclimate.com/github/hitmands/gulp-sass-pedigree) [![Test Coverage](https://codeclimate.com/github/hitmands/gulp-sass-pedigree/badges/coverage.svg)](https://codeclimate.com/github/hitmands/gulp-sass-pedigree)

Incremental Caching System for Gulp and NodeSass

## Where
 - https://github.com/hitmands/gulp-sass-pedigree
 - https://www.npmjs.com/package/gulp-sass-pedigree

## Info
There are a lot of community-based solutions which face the issue regarding the gulp incremental building ([`gulp-progeny`](https://github.com/HerringtonDarkholme/gulp-progeny/) is definitely one of these). Because of its agnostic nature, gulp cannot know the related files to the one edited, and, because of this, it needs to *resync* all the sources with their corresponding outputs `gulp.src('src/**/*.scss').pipe(gulp.dest('./dest'))`.

#### Why choosing `gulp-sass-progeny`?
Because it is specifically designed on top of [`gulp`](http://gulpjs.com/) and [`node-sass`](https://github.com/sass/node-sass), it isn't thought to be agnostic and work with different file types (as `gulp-progeny` is). For example, while editing a parent, you don't need to add any *imported file* to the stream because that is how sass works, otherwise, **you need to add any parent while editing a child and that is what `gulp-sass-pedigree` exactly does**. 

#### Features
  - No unnecessary file system access (`fs.existsSync` only)
  - Multiple inline imports `@import "foo", "baz", "foobaz";`
  - Nested imports `.foo { @import "baz"; }` and `.foobaz { @import "foo"; }`
  - Top files only (eg: if `a => b => c` while editing `c`, only `a` will be added to the stream)
  - Sass Specific file name convention (eg: it handles `foo`, but also `_foo` with or without extension)

## Getting Started
`npm install --save-dev gulp-sass-pedigree`

## gulpfile
```javascript

const gulp = require('gulp');
const sass = require('gulp-sass');
const options = {
  ext: '.scss', // string (the file extension)
  verbose: false // boolean,
  includePaths: [] // string[] (additional paths where to look for files
};
const {study, getAncestors} = require('gulp-sass-pedigree')(options);

gulp.task('sass:all', () => {

  return gulp
    .src('path/to/**/*.scss')
    .pipe(study())
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
