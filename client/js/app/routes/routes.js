define([
	'app/app',
	'app/controllers/controllers',
	'app/partials',
	'framework/logger',
	'./config'
], function (app, controllers, partials, logger, config) {

	'use strict';
	var access = config.accessLevels;
	app.

		//configure routes
		config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
			$locationProvider.html5Mode(true);
			$routeProvider.

				when('/groups/:groupId', {
					templateUrl: partials.group,
					controller: 'GroupView',
					access: access.auth
				}).
				when('/groups/:groupId/:action', {
					templateUrl: partials.group,
					controller: 'GroupView',
					access: access.auth
				}).

				when('/groups', {
					templateUrl: partials.groups,
					controller: 'GroupsView',
					access: access.auth
				}).

				when('/', {
					templateUrl: partials.register,
					controller: 'Register',
					access: access.anon
				}).

				when('/login', {
					templateUrl: partials.login,
					controller: 'Login',
					access: access.anon
				}).

				when('/logout', {
					controller: 'Logout',
					access: access.auth
				}).

				//default to group listing
				//TODO add 404
				otherwise({redirectTo: '/'});

			var interceptor = ['$location', '$q', function ($location, $q) {
				function success(response) {
					return response;
				}

				function error(response) {

					if (response.status === 401) {
						$location.path('/login');
						return $q.reject(response);
					}
					else {
						return $q.reject(response);
					}
				}

				return function (promise) {
					return promise.then(success, error);
				}
			}];

			$httpProvider.responseInterceptors.push(interceptor);
		}]).

		run(['$rootScope', '$location', '$routeParams', 'users', function ($rootScope, $location, $routeParams, users) {

			$rootScope.$on("$routeChangeStart", function (event, next, current) {
				$rootScope.error = null;
				logger.log('Route change start', $location.path(), $routeParams);

				//Authorizatio needed
				if (next.access === access.auth && !users.isLoggedIn()) {

					logger.log('User not logged in');
					$location.path('/login');

				}
			});

			$rootScope.$on('$routeChangeSuccess', function (scope, current, pre) {
				logger.log('Route changed', $location.path(), $routeParams);

			});

			$rootScope.appInitialized = true;
		}]);


	//no export
});