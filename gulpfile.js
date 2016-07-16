'use strict';

const clean = require('gulp-clean');
const gulp = require('gulp');
const gulpDotFlatten = require('./libs/gulp-dot-flatten.js');
const gulpRename = require('gulp-rename');
const gulpScreepsUpload = require('./libs/gulp-screeps-upload.js');
const path = require('path');
const ts = require('gulp-typescript');
const tsconfigGlob = require('tsconfig-glob');
const tslint = require('gulp-tslint');
const tsconfig = ts.createProject('tsconfig.json');
const tsproject = require('tsproject');

const config = require('./config.json');

gulp.task('update-tsconfig-files', () => {
  return tsconfigGlob({
    configPath: '.',
    indent: 2
  });
});

gulp.task('lint', () => {
  return gulp.src(['./src/**/*.ts', '!./src/**/*.d.ts'])
    .pipe(tslint({ formatter: 'prose' }))
    .pipe(tslint.report({ summarizeFailureOutput: true }))
    .on('error', (error) => { this.emit('end') });
});

gulp.task('clean', () => {
  return gulp.src('dist', { read: false })
    .pipe(clean());
});

gulp.task('compile', ['lint', 'clean', 'update-tsconfig-files'], () => {
  return tsconfig.src()
    .pipe(ts(tsconfig))
    .on('error', (error) => { process.exit(1); })
    .js.pipe(gulp.dest('dist'))

  // Alternate compiler: more verbose but does not stop on errors
  //
  //  return tsproject.src('./tsconfig.json')
  //     .pipe(gulp.dest('dist'));
  //
});

gulp.task('flatten', ['compile'], () => {
  return gulp.src('./dist/src/**/*.js')
    .pipe(gulpDotFlatten(0))
    .pipe(gulp.dest('./dist/flat'))
});

gulp.task('upload', ['flatten'], () => {
  return gulp.src('./dist/flat/*.js')
    .pipe(gulpRename(path => { path.extname = ''; }))
    .pipe(gulpScreepsUpload(config.email, config.password, config.branch, 0))
});

gulp.task('watch', ['build'], () => {
  gulp.watch('./src/**/*.ts', ['build']);
});

gulp.task('build', ['upload']);
gulp.task('test', ['lint']);
gulp.task('default', ['watch']);
