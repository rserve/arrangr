define(function (require, exports, module) {

	'use strict';

	var app = require('app');


	app.config(['$httpProvider', function ($httpProvider) {

		//http interceptor to sync authenticated state
		var interceptor = ['$location', '$q', 'authState', function ($location, $q, authState) {
			function success(response) {
				return response;
			}

			function error(response) {

				if (response.status === 401) {

					authState.removeUserState();

					$location.path('/login');
					return $q.reject(response);
				}
				else {
					return $q.reject(response);
				}
			}

			return function (promise) {
				return promise.then(success, error);
			};
		}];

		$httpProvider.responseInterceptors.push(interceptor);

	}]);
});