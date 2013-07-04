
//TODO duplication here because of jasmine spec runner, look into correct solution
require.config({

	paths: {
		jquery: '../lib/jquery-1.8.3',
		bootstrap: '../lib/bootstrap/js/bootstrap',
		underscore: '../lib/underscore',
		angular: 'https://ajax.googleapis.com/ajax/libs/angularjs/1.0.6/angular',
		json: '../lib/require/json',
		text: '../lib/require/text',
		data: '../data'


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

define({

	baseUrl:'/js',
	paths: {
		jquery: '../lib/jquery-1.8.3',
		bootstrap: '../lib/bootstrap/js/bootstrap',
		underscore: '../lib/underscore',
		angular: 'https://ajax.googleapis.com/ajax/libs/angularjs/1.0.6/angular',
		json: '../lib/require/json',
		text: '../lib/require/text',
		data: '../data'

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