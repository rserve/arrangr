//make sure all dependencies are loaded
require([
	'es5shim',
	'angular',
	'json!data/config.json',
    'angular-ui-router',
    'angular-flash',
    'angular-moment',
    'angular-sanitize',
    'emoji',
    'socketio',
    'socket',
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
	'config/finalize',
	'config/socket'
], function (es5shim, angular, config) {

	'use strict';

	//kick off!
	angular.element(document).ready(function () {

		// Get user state before bootstrap so we can route correctly
		var $http = angular.bootstrap().get('$http');
		$http.get("/api/users/session").success(function(user) {
			sessionStorage.setItem("user", user.id);
			angular.bootstrap(document, [config.appName]);
		}).error(function(data, status) {
			if(status == 401) {
				angular.bootstrap(document, [config.appName]);
			} else {
			}
		});
	});
});