require.config({
	paths: {
		jquery: 'http://code.jquery.com/jquery-1.8.2',
		bootstrap: '../lib/bootstrap/js/bootstrap',
		angular: 'https://ajax.googleapis.com/ajax/libs/angularjs/1.0.6/angular'
	},
	shim: {
		angular: {
			deps: ['jquery'], // for angular.element
			exports: 'angular'
		},
		'bootstrap': {
			deps: ['jquery']
		}
	},
	priority: [
		"angular"
	]

});

//make sure all dependencies are loaded
require([
	'angular',
	'jquery',
	'app',
	'controllers',
	'routes'
], function (angular, jquery) {

	//kick off!
	angular.element(document).ready(function () {
		angular.bootstrap(document, ['rserve']);
	});
});