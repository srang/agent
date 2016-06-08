var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var args = require('yargs').argv;
var gulpif = require('gulp-if');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var webpackStream = require('webpack-stream');
var tslint = require('gulp-tslint');
var ts = require('gulp-typescript');
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

gulp.task('compile-serializer', function() {
  gulp.src('./config-serializer/**/*.ts')
    .pipe(tslint())
    .pipe(tslint.report('verbose'));

  var compiled = serializer.src()
    .pipe(ts(serializer));
  compiled.js.pipe(gulp.dest('./config-serializer'));
  return gulp.src('./config-serializer/serializer.ts')
    .pipe(webpackStream(require('./config-serializer/webpack.config.js')))
    .pipe(gulp.dest('build/'));
});

gulp.task('compile-tests', function() {
  gulp.src('./tests/**/*.ts')
    .pipe(tslint())
    .pipe(tslint.report('verbose'));

  var compiled = tests.src()
    .pipe(ts(tests));
  return compiled.js.pipe(gulp.dest('./tests'));
});

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
