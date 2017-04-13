# gulp-sass-pedigree
[![Build Status](https://travis-ci.org/hitmands/gulp-sass-pedigree.svg?branch=master)](https://travis-ci.org/hitmands/gulp-sass-pedigree) [![Code Climate](https://codeclimate.com/github/hitmands/gulp-sass-pedigree/badges/gpa.svg)](https://codeclimate.com/github/hitmands/gulp-sass-pedigree) [![Test Coverage](https://codeclimate.com/github/hitmands/gulp-sass-pedigree/badges/coverage.svg)](https://codeclimate.com/github/hitmands/gulp-sass-pedigree)

Incremental Caching System for Gulp and NodeSass

## Where
 - https://github.com/hitmands/gulp-sass-pedigree
 - https://www.npmjs.com/package/gulp-sass-pedigree

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
