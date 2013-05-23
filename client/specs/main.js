/*global jasmine */
requirejs.config({
	baseUrl: 'js',
	paths: {
		'specs': "../specs",
		'jasmine': "../lib/jasmine-1.3.1/jasmine",
		'jasmine-html': "../lib/jasmine-1.3.1/jasmine-html",
		underscore: '../lib/underscore',
		util: 'framework/util'
	},
	shim: {
		'jasmine': {
			exports: 'jasmine'
		},
		'jasmine-html': {
			deps: ['jasmine'],
			exports: 'jasmine-html'
		},
		'underscore': {
			exports: '_'
		}
	}

});

// Start the main app logic.
requirejs(['jasmine', 'jasmine-html'],
	function () {

		'use strict';

		//setup jasmine
		var jasmineEnv = jasmine.getEnv();
		jasmineEnv.updateInterval = 1000;

		var htmlReporter = new jasmine.HtmlReporter();

		jasmineEnv.addReporter(htmlReporter);

		jasmineEnv.specFilter = function (spec) {
			return htmlReporter.specFilter(spec);
		};


		function execJasmine() {
			jasmineEnv.execute();
		}

		//run our specs
		require([
			'specs/sample.spec',
			'specs/util.spec'
		], function () {

			execJasmine();
		});
	});

