require.config({

	paths: {
		jquery: '../lib/jquery-1.8.3',
		bootstrap: '../lib/bootstrap/js/bootstrap',
		underscore: '../lib/underscore',
		angular: 'https://ajax.googleapis.com/ajax/libs/angularjs/1.0.6/angular',
		angularcookie: 'https://ajax.googleapis.com/ajax/libs/angularjs/1.0.6/angular-cookies',
		json: '../lib/require/json',
		text: '../lib/require/text',
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
	'json!data/config.json',
	'angularcookie',
	'jquery',
	'app',
	'services/services',
	'controllers/controllers',
	'filters/filters',
	'directives/directives',
	'config/http',
	'config/routes',
	'config/finalize',
], function (angular, config) {

	'use strict';

	console.log('Dependencies loaded');

	//kick off!
	angular.element(document).ready(function () {
		console.log('Document ready, bootstrapping app');
		angular.bootstrap(document, [config.appName]);
	});
});