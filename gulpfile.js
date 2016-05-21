var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var args = require('yargs').argv;
var gulpif = require('gulp-if');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var webpackStream = require('webpack-stream');
var tslint = require('gulp-tslint');
var ts = require('gulp-typescript');

var serializer = ts.createProject('config-serializer/tsconfig.json');

var paths = {
  sassAll: 'sass/**/*.scss',
  cssDest: 'css'
}

gulp.task('serve', function () {
  browserSync.init({
    server: {
      baseDir: "./"
    },
  });

  gulp.watch(['*.html', '*.css', '*.js']).on('change', browserSync.reload);
});

gulp.task('sass', function () {
  return gulp.src(paths.sassAll)
    .pipe(gulpif(args.debug, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(args.debug, sourcemaps.write()))
    .pipe(gulp.dest(paths.cssDest));
});

gulp.task('watch', function () {
  gulp.watch(paths.sassAll, ['sass']);
});

gulp.task('webpack', function () {
  return gulp.src('./src/boot.ts')
    .pipe(webpackStream(require('./webpack.config.js')))
    .pipe(gulp.dest('build/'));
});

gulp.task('compile', function() {
  gulp.src('./config-serializer/**/*.ts')
    .pipe(tslint())
    .pipe(tslint.report('verbose'));

  var compiled = serializer.src()
    .pipe(ts(serializer));
  return compiled.js.pipe(gulp.dest('./config-serializer'));

});

gulp.task('assert', ['compile'], function() {
  var test = require('./config-serializer/serializer');
  test.serializeJSON('./config-serializer/uhk-config.json', './config-serializer/uhk-test.bin');
  test.deserializeBin('./config-serializer/uhk-test.bin', './config-serializer/uhk-test.json');
  var result = test.compareConfigs('./config-serializer/uhk-test.bin','./config-serializer/uhk-config.json');
  //test.compareConfigs('./config-serializer/uhk-config.bin','./config-serializer/uhk-test.json');
  return result;
});

gulp.task('test', ['compile','assert']);

gulp.task('default', ['sass', 'webpack']);
