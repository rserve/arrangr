require.config({

	paths: {
		jquery: 'http://code.jquery.com/jquery-1.8.2',
		bootstrap: '../lib/bootstrap/js/bootstrap',
		underscore: '../lib/underscore',
		angular: 'https://ajax.googleapis.com/ajax/libs/angularjs/1.0.6/angular',
		angularcookie: 'https://ajax.googleapis.com/ajax/libs/angularjs/1.0.6/angular-cookies',
		json: '../lib/require/json',
		text: '../lib/require/text',
		util: 'framework/util',
		config: '../data/config',
		data: '../data'


	},
	shim: {
		angular: {
			deps: ['jquery'], // for angular.element
			exports: 'angular'
		},
		angularcookie:{
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

});

//make sure all dependencies are loaded
require([
	'angular',

	'json!config.json',
	'framework/logger',
	'angularcookie',
	'jquery',
	'app/app',
	'app/services/services',
	'app/controllers/controllers',
	'app/filters/filters',
	'app/directives/directives',
	'app/routes/routes'
], function (angular, config, logger) {

	'use strict';

	logger.log('Dependencies loaded');
	//kick off!
	angular.element(document).ready(function () {
		logger.log('Document ready, starting app');
		angular.bootstrap(document, [config.appName]);
	});
});