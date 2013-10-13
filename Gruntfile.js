/* global require, requirejs, define, jasmine */
module.exports = function (grunt) {

	'use strict';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		/*
		 * https://github.com/gruntjs/grunt-contrib-jshint
		 * http://www.jshint.com/docs/
		 * */

		jshint: {

			options: {

				// Enforcing
				camelcase: true,    // allow camelCase and UPPER_CASE only
				curly: true,        // always put curly braces around blocks in loops and conditionals
				immed: true,        // prohibit the use of immediate function invocations without wrapping them in parentheses
				maxdepth: 10,       // maximum level of nested blocks
				maxlen: 160,        // maximum length of a line
				maxparams: 10,      // maximum number of formal parameters allowed per function
				maxstatements: 100, // maximum number of statements allowed per function
				newcap: true,       // require capitalized names of constructor functions
				noarg: true,        // prohibit the use of arguments.caller and arguments.callee
				nonew: true,        // prohibit the use of constructor functions for side-effects
				strict: true,       // require "use strict" statement
				undef: true,        // prohibit the use of explicitly undeclared variables
				validthis: true,    // assume we know how to handle this

				// Relaxing
				boss: true,      // allow the use of assignments in cases where comparisons are expected
				eqnull: true,    // allow == null comparisons
				es5: false,       // allow ECMAScript 5 specific features
				evil: true,      // allow the use of eval
				expr: true,      // allow expressions where normally you would expect to see assignments or function calls
				smarttabs: true, // allow mixed tabs and spaces when the latter are used for alignmnent only
				sub: true,       // allow using [] notation when it can be expressed in dot notation

				// Environment
				browser: true, // define globals exposed by modern browsers
				devel: true,    // define globals that are usually used for logging


				// Global variables, the boolean value determines if the variable is assignable
				globals: {
					self: false,
					define: false,
					require: false,
					requirejs: false,
					exports: false,
					module: false
				}
			},
			client: ['gruntfile.js', 'client/js/**/*.js'],
			node: {
				options: {
					curly: false,
					node: true,
					browser: false,
					strict: false,
					immed: false,
					es5: false
				},
				files: {
					src: ['server/**/*.js']
				}
			}

		},
		karma: {
			// watch files and re-run tests. Chrome will run tests
			watch: {
				configFile: 'karma.conf.js',
				singleRun: false,
				autoWatch: true,
				browsers: ['Chrome']
			},
			//continuous integration mode: run tests once in PhantomJS browser.
			continuous: {
				configFile: 'karma.conf.js',
				singleRun: true,
				browsers: ['PhantomJS']
			}
		},
		// squelch jshint warning
		/* jshint camelcase: false */
		jasmine_node: {
			specNameMatcher: '.spec',
			projectRoot: "server",
			forceExit: true,
			jUnit: {
				report: false,
				savePath: "./build/reports/jasmine/",
				useDotNotation: true,
				consolidate: true
			}
		},

		nodemon: {
			dev: {
				options: {
					watchedFolders: [ 'server' ]
				}
			}
		},
		/*
		* Build task with require.js optimizer
		* */
		requirejs: {
			build: {
				options: {
					appDir: "client",
					baseUrl: "js",
					dir: "build/client",

					paths: {
						jquery: 'empty:',
						'jquery-filedrop': 'empty:',
						bootstrap: 'empty:',
						underscore: 'empty:',
						moment: 'empty:',
						angular: 'empty:',
						'angular-ui-router': 'empty:',
						'angular-flash': 'empty:',
						'angular-moment': 'empty:',
						json: '../lib/require/json',
						text: '../lib/require/text',
						data: '../data'

					},
					shim: {
						jquery: {
							exports: 'jQuery'
						},
						angular: {
							deps: ['jquery'], // for angular.element
							exports: 'angular'
						},
						'bootstrap': {
							deps: ['jquery']
						},
						'underscore': {
							exports: '_'
						},
						'angular-ui-router': {
							deps: ['angular']
						},
						'angular-flash': {
							deps: ['angular']
						},
						'angular-moment': {
							deps: ['moment','angular']
						},
						'jquery-filedrop': {
							deps: ['jquery']
						}
					},
					// skip specs, "hidden" folders and libraries except text & json
					// TODO regexp could be simplified
					fileExclusionRegExp: /^(specs|angular|jquery|require\.js|underscore|bootstrap|\.)/,
					optimizeCss: 'standard',
					//optimize:'none',
					removeCombined: true,
					modules: [
						{
							name: "main",

							//keep json files outside of build
							excludeShallow: [
								'json!data/config.json',
								'json!data/phrases_en.json'
							]
						}
					]
				}

			}
		},
		copy: {
			build: {
				files: [
					{expand: true, cwd: 'build_statics//', src: ['**'], dest: 'build/client/'}
				]
			}
		},
		clean: {
			build: ["build"]
		}
	});


	//Deps tasks
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-jasmine-node');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('build', ['clean:build','requirejs', 'copy:build']);

	// default tasks
	grunt.registerTask('test', ['jshint:client', 'jshint:node', 'karma:continuous', 'jasmine_node']);

	grunt.registerTask('default', ['test']);


};