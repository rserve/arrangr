require.config({

	paths: {
		jquery: 'http://code.jquery.com/jquery-1.8.2',
		bootstrap: '../lib/bootstrap/js/bootstrap',
		underscore: '../lib/underscore',
		angular: 'https://ajax.googleapis.com/ajax/libs/angularjs/1.0.6/angular',

		util: 'framework/util'

	},
	shim: {
		angular: {
			deps: ['jquery'], // for angular.element
			exports: 'angular'
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

});

//make sure all dependencies are loaded
require([
	'angular',
	'app/config',
	'framework/logger',
	'jquery',
	'app/app',
	'app/controllers',
	'app/routes'
], function (angular, config, logger) {

	'use strict';

	logger.log('Dependencies loaded');
	//kick off!
	angular.element(document).ready(function () {
		logger.log('Document ready, starting app');
		angular.bootstrap(document, [config.appName]);
	});
});