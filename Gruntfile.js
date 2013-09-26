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
		jasmine: {
			src: 'client/js/**/*.js',
			options: {
				specs: 'client/specs/**/*spec.js',
				template: require('grunt-template-jasmine-requirejs'),
				templateOptions: {

					/*
					 * Because we changed how require config is loaded due to build step (separate require config main.js),
					 * unfortunately we have to repeat the whole require config here for the jasmine runner.
					 * */
					//requireConfigFile: 'client/js/config.js',
					requireConfig: {
						baseUrl: 'client/js/', // to play nice with jasmine runner

						paths: {

							'client/js': './', // to play nice with jasmine runner

							jquery: '../lib/jquery-1.8.3',
							bootstrap: '../lib/bootstrap/js/bootstrap',
							underscore: '../lib/underscore',
                            angular: '../lib/angular-1.0.8',
                            angularuirouter: '../lib/angular-ui-router',
							json: '../lib/require/json',
							text: '../lib/require/text',
							data: '../data'
						},
						shim: {
							angular: {
								deps: ['jquery'], // for angular.element
								exports: 'angular'
							},
                            'angularuirouter': {
                                deps: ['angular']
                            },
							'bootstrap': {
								deps: ['jquery']
							},
							'underscore': {
								exports: '_'
							}

						},
						priority: [
							"angular"
						]

					}
				}
			}
		},
		// squelch jhint warning
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
		requirejs: {
			compile: {
				options: {
					appDir: "client",
					baseUrl: "js",
					dir: "build/client",

					paths: {
						jquery: 'empty:',
						bootstrap: 'empty:',
						underscore: 'empty:',
						angular: 'empty:',
						angularcookie: 'empty:',
						json: '../lib/require/json',
						text: '../lib/require/text',
						data: '../data'

					},
					shim: {
						angular: {
							deps: ['jquery'], // for angular.element
							exports: 'angular'
						},
						angularcookie: {
							deps: ['angular']
						},
						'bootstrap': {
							deps: ['jquery']
						},
						'underscore': {
							exports: '_'
						}

					},
					// skip libraries except text & json
					fileExclusionRegExp: /^(specs|index.jasmine.html|jquery|bootstrap|underscore|angular|jasmine|index.html|prod-index.html)/,
					optimizeCss: 'standard',

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
			postBuild: {
				files: [
					//copy all third party libraries to build
					{expand: true, src: ['client/lib/**'], dest: 'build/'},

					//copy prod-index.html to index.html for build
					{ expand: true, src: ['client/prod-index.html'], dest: 'build/client', filter: 'isFile',
						rename: function (dest, src) {
							return dest + '/index.html';
						}},

				]
			}
		}
	});


	//Deps tasks
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-jasmine-node');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-copy');

	//lint tasks
	grunt.registerTask('lint', ['jshint:client', 'jshint:node']);
	grunt.registerTask('lint_browser', ['jshint:client']);
	grunt.registerTask('lint_node', ['jshint:node']);

	//spec tastks
	grunt.registerTask('spec', ['jasmine', 'jasmine_node']);
	grunt.registerTask('spec_browser', ['jasmine']);
	grunt.registerTask('spec_node', ['jasmine_node']);
	grunt.registerTask('build', ['requirejs', 'copy:postBuild']);

	// default tasks
	grunt.registerTask('all', ['jshint:client', 'jshint:node', 'jasmine_node']);

	grunt.registerTask('default', ['all']);


};