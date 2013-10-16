//make sure all dependencies are loaded
require([
	'es5shim',
	'angular',
	'json!data/config.json',
    'angular-ui-router',
    'angular-flash',
    'angular-moment',
	'jquery',
	'jquery-filedrop',
	'app',
	'services/services',
	'controllers/controllers',
	'filters/filters',
	'directives/directives',
	'config/flash',
	'config/http',
	'config/routes',
	'config/finalize'
], function (es5shim, angular, config) {

	'use strict';

	console.log('Dependencies loaded');

	//kick off!
	angular.element(document).ready(function () {
		console.log('Document ready, bootstrapping app');
		angular.bootstrap(document, [config.appName]);
	});
});