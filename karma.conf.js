// Karma configuration
// Generated on Sat Oct 12 2013 13:49:19 GMT+0200 (W. Europe Daylight Time)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '',

    // frameworks to use
    frameworks: ['jasmine', 'requirejs'],


    // list of files / patterns to load in the browser
    files: [
		{pattern: 'client/lib/**/*.js', included: false},
		{pattern: 'client/js/**/*.js', included: false},
		{pattern: 'client/specs/**/*spec.js', included: false},

		'client/specs/test-main.js'

    ],

    // list of files to exclude
    exclude: [
      
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000

  });
};
