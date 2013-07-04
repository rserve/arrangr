define({

	baseUrl:'/js',
	paths: {
		jquery: '../lib/jquery-1.8.3.min',
		bootstrap: '../lib/bootstrap/js/bootstrap.min',
		underscore: '../lib/underscore-min',
		angular: '../lib/angular.1.0.6.min',
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
	priority: [
		"angular"
	]

});