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
				camelcase: false,    // allow camelCase and UPPER_CASE only
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
				es5: true,       // allow ECMAScript 5 specific features
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
					node:true,
					browser:false,
					strict:false,
					immed:false
				},
				files: {
					src: ['server/**/*.js']
				}
			}

		},
		jasmine : {
			src : 'client/js/**/*.js',
			options : {
				specs : 'client/specs/**/*spec.js',
				template: require('grunt-template-jasmine-requirejs'),
				templateOptions: {
					requireConfigFile: 'client/js/main.js',
					requireConfig: {
						baseUrl:'client/js/',
						paths:{
							'client/js':'./'
						}
					}
				}
			}
		},
		// squelch jhint warning
		/* jshint camelcase: false */
		jasmine_node: {
			specNameMatcher: '.spec',
			projectRoot: "server",
			requirejs: false,
			forceExit: true,
			jUnit: {
				report: false,
				savePath : "./build/reports/jasmine/",
				useDotNotation: true,
				consolidate: true
			}
		}

	});


	//Deps tasks
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-jasmine-node');

	//lint tasks
	grunt.registerTask('lint', ['jshint:client', 'jshint:node']);
	grunt.registerTask('lint_browser', ['jshint:client']);
	grunt.registerTask('lint_node', ['jshint:node']);

	//spec tastks
	grunt.registerTask('spec', ['jasmine', 'jasmine_node']);
	grunt.registerTask('spec_browser', ['jasmine']);
	grunt.registerTask('spec_node', ['jasmine_node']);

	// default tasks
	grunt.registerTask('all', ['jshint:client', 'jshint:node','jasmine', 'jasmine_node']);

	grunt.registerTask('default', ['all']);


};