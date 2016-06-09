// Karma configuration
// Generated on Sat May 21 2016 13:38:56 GMT-0500 (CDT)

module.exports = function(config) {
  //var webpackconfig = require('./build/webpack.config.js');
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'build/**/*.js'
    ],


    // list of files to exclude
    exclude: [
      'build/uhk.js',
      'build/uhk.js.map',
      'build/webpack.config.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        // add webpack as preprocessor
        'build/serializer.js': ['webpack'],
        'build/tests.js': ['webpack']
        //'config-serializer/**/*.js': ['webpack'],
        //'tests/**/*.js': ['webpack']
    },
    webpack: {
      resolve: {
          extensions: ['', '.webpack.js', '.web.js', '.ts', '.js'],
          alias: { },
          modulesDirectories: [
              './node_modules'
          ]
      },
      module: {
          loaders: [
              { test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/ }
          ]
      },
      node: {
          fs: "empty"
      }
    },

    // Webpack please don't spam the console when running in karma!
    webpackServer: { noInfo: true },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
