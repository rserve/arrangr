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
			files: ['gruntfile.js', 'client/js/**/*.js', 'client/specs/**/*.js'],
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
			}

		},
		jasmine : {
			src : 'client/js/**/*.js',
			options : {
				specs : 'client/specs/**/*.js',
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
		}

	});



	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-jasmine');

	grunt.registerTask('test', ['jshint', 'jasmine']);

	grunt.registerTask('default', ['test']);


};