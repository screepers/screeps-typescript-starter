'use strict';

const clean = require('gulp-clean');
const gulp = require('gulp');
const gulpDotFlatten = require('./libs/gulp-dot-flatten.js');
const gulpRename = require('gulp-rename');
const gulpScreepsUpload = require('./libs/gulp-screeps-upload.js');
const path = require('path');
const PluginError = require('gulp-util').PluginError;
const ts = require('gulp-typescript');
const tslint = require('gulp-tslint');
const tsconfig = ts.createProject('tsconfig.json', { typescript: require('typescript') });

const config = require('./config.json');

gulp.task('lint', () => {
  return gulp.src('./src/**/*.ts')
    .pipe(tslint({ formatter: 'prose' }))
    .pipe(tslint.report({
      summarizeFailureOutput: true,
      emitError: false,
    }));
});

gulp.task('clean', () => {
  return gulp.src('dist', { read: false })
    .pipe(clean());
});

let compileFailed = false;

gulp.task('compile', ['lint', 'clean'], () => {
  compileFailed = false;
  return tsconfig.src()
    .pipe(ts(tsconfig))
    .on('error', (err) => { compileFailed = true; })
    .js.pipe(gulp.dest('dist/js'));
});

gulp.task('checked-compile', ['compile'], () => {
  if (!compileFailed)
    return true;
  throw new PluginError('gulp-typescript', 'failed to compile: not executing further tasks');
});

gulp.task('flatten', ['checked-compile'], () => {
  return gulp.src('./dist/js/**/*.js')
    .pipe(gulpDotFlatten(0))
    .pipe(gulp.dest('./dist/flat'));
});

gulp.task('upload', ['flatten'], () => {
  return gulp.src('./dist/flat/*.js')
    .pipe(gulpRename(path => { path.extname = ''; }))
    .pipe(gulpScreepsUpload(config.email, config.password, config.branch, 0));
});

gulp.task('watch', () => {
  gulp.watch('./src/**/*.ts', ['build']);
});

gulp.task('build', ['upload']);
gulp.task('test', ['lint']);
gulp.task('default', ['watch']);
