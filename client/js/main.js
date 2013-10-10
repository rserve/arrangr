//make sure all dependencies are loaded
require([
	'angular',
	'json!data/config.json',
    'angular-ui-router',
    'angular-flash',
	'jquery',
	'jquery-filedrop',
	'app',
	'services/services',
	'controllers/controllers',
	'filters/filters',
	'directives/directives',
	'config/http',
	'config/routes',
	'config/finalize'
], function (angular, config) {

	'use strict';

	console.log('Dependencies loaded');

	//kick off!
	angular.element(document).ready(function () {
		console.log('Document ready, bootstrapping app');
		angular.bootstrap(document, [config.appName]);
	});
});