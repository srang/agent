var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var args = require('yargs').argv;
var gulpif = require('gulp-if');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var webpackStream = require('webpack-stream');
var tslint = require('gulp-tslint');
var ts = require('gulp-typescript');
var rimraf = require('gulp-rimraf');
var ignore = require('gulp-ignore');
var typings = require('gulp-typings')
var testServer = require('karma').Server;

var serializer = ts.createProject('config-serializer/tsconfig.json');
var tests = ts.createProject('tests/tsconfig.json');

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

gulp.task('typings', function() {
  return gulp.src('./typings.json')
    .pipe(typings());
});

gulp.task('clean-serializer', function() {
  return gulp.src(['./config-serializer/**/*.js',
      './build/serializer.js',
      '!./config-serializer/webpack.config.js'])
    .pipe(rimraf());
});

gulp.task('lint-serializer', function() {
  return gulp.src('./config-serializer/**/*.ts')
    .pipe(tslint())
    .pipe(tslint.report('verbose'));
});

gulp.task('build-serializer', ['clean-serializer'], function() {
  return serializer.src()
    .pipe(ts(serializer))
    .pipe(gulp.dest('./config-serializer'));
});

gulp.task('webpack-serializer', ['build-serializer'], function() {
  return gulp.src('./config-serializer/serializer.ts')
    .pipe(webpackStream(require('./config-serializer/webpack.config.js')))
    .pipe(gulp.dest('build/'));
});

gulp.task('compile-serializer', ['clean-serializer', 'lint-serializer',
    'build-serializer', 'webpack-serializer']);

gulp.task('clean-tests', function() {
  return gulp.src(['./tests/**/*.js',
      './build/tests.js',
      '!./tests/webpack.config.js'])
    .pipe(rimraf());
});

gulp.task('lint-tests', function() {
  return gulp.src('./tests/**/*.ts')
    .pipe(tslint())
    .pipe(tslint.report('verbose'));
});

gulp.task('build-tests', ['clean-tests'], function() {
  return tests.src()
    .pipe(ts(tests))
    .pipe(gulp.dest('./tests'));
});

gulp.task('webpack-tests', ['build-tests'], function() {
  return gulp.src('./tests/**.ts')
    .pipe(webpackStream(require('./tests/webpack.config.js')))
    .pipe(gulp.dest('build/'));
});

gulp.task('compile-tests', ['clean-tests',
    'build-tests', 'webpack-tests']);

gulp.task('test', ['compile-serializer', 'compile-tests'], function() {
  return new testServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }).start();
});


gulp.task('assert', ['compile-serializer'], function() {
  var serial = require('./config-serializer/serializer');
  var jsConfig = './config-serializer/uhk-config.json';
  var binConfig = './config-serializer/uhk-config.bin';
  var jsTest = './config-serializer/uhk-test.json';
  var binTest = './config-serializer/uhk-test.bin';

  var config = serial.readJSON(jsConfig);
  serial.writeBIN(config, binTest);
  var result = serial.compareConfigs(binTest, jsConfig);
  console.log('Serialize pass: ' + result);

  config = serial.readBIN(binConfig);
  serial.writeJSON(config, jsTest);
  result = serial.compareConfigs(binConfig, jsTest);
  console.log('Deserialize pass: ' + result);

  return result;
});

gulp.task('default', ['sass', 'webpack']);
