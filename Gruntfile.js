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
			options: {
				specNameMatcher: '.spec',
				forceExit: true,
				jUnit: {
					report: false,
					savePath: "./build/reports/jasmine/",
					useDotNotation: true,
					consolidate: true
				}
			},
			all: ['server/specs']
		},

		nodemon: {
			dev: {
				script: 'server/server',
				options: {
					watch: [ 'server' ]
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
						'es5shim': 'empty:',
						jquery: 'empty:',
						'jquery-filedrop': 'empty:',
						bootstrap: 'empty:',
						underscore: 'empty:',
						moment: 'empty:',
						angular: 'empty:',
						'angular-ui-router': 'empty:',
						'angular-flash': 'empty:',
						'angular-moment': 'empty:',
						'angular-sanitize': 'empty:',
						'emoji': 'empty:',
						'socketio': 'empty:',
						'socket': 'empty:',
						json: '../../node_modules/requirejs-plugins/src/json',
						text: '../../node_modules/requirejs-text/text',
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
							deps: ['moment', 'angular']
						},
						'angular-sanitize': {
							deps: ['angular']
						},
						'jquery-filedrop': {
							deps: ['jquery']
						},
						'emoji': {
							deps: ['angular']
						},
						'socket': {
							deps: ['angular']
						},
						'socketio': {
							exports: ['io']
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
                    {
                        expand: true,
                        cwd: 'build_statics/',
                        src: ['**'],
                        dest: 'build/client/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        cwd: 'node_modules',
                        src: [
                            'angular-emoji-filter/dist/emoji.min.css',
                            'bootstrap/dist/css/bootstrap.min.css'
                        ],
                        dest: 'build/client/css/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        cwd: 'node_modules',
                        src: [
                            'bootstrap/dist/fonts/*'
                        ],
                        dest: 'build/client/fonts/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        cwd: 'node_modules',
                        src: [
                            'requirejs/require.js',
                            'jquery/dist/jquery*',
                            'underscore/underscore-min.js',
                            'bootstrap/dist/js/bootstrap.min.js',
                            'angular-emoji-filter/dist/emoji.min.js',
                            'angular/angular.min.js',
                            'angular/angular.min.js.map',
                            'angular/angular.js',
                            'angular-flash/dist/angular-flash.min.js',
                            'angular-moment/angular-moment.min.js',
                            'angular-moment/angular-moment.min.js.map',
                            'angular-ui-router/release/angular-ui-router.min.js',
                            'angular-sanitize/angular-sanitize.min.js',
                            'angular-sanitize/angular-sanitize.min.js.map',
                            'es5-shim/es5-shim.min.js',
                            'es5-shim/es5-shim.map',
                            'jquery-filedrop/jquery.filedrop.js',
                            'moment/min/moment.min.js'
                        ],
                        dest: 'build/client/lib'
                    }
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

	grunt.registerTask('build', ['clean:build', 'requirejs', 'copy:build']);

	// default tasks
	grunt.registerTask('test', ['jshint:client', 'jshint:node', 'jasmine_node']);

	grunt.registerTask('default', ['test']);


};