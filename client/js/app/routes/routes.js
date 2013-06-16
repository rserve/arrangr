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
				when('/groups/:groupId', {
					templateUrl: partials.group,
					controller: 'Group',
					access: access.auth
				}).
				when('/groups/:groupId/:email', {
					templateUrl: partials.empty,
					controller: 'JoinGroup',
					access: access.anon
				}).


				when('/groups', {
					templateUrl: partials.groups,
					controller: 'Groups',
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
					templateUrl: partials.empty,
					controller: 'Logout',
					access: access.auth
				}).

				when('/404',
				{
					templateUrl: partials.notFound,
					access: access.public
				});
			$routeProvider.otherwise({redirectTo: '/404'});

			var interceptor = ['$location', '$q', '$rootScope', function ($location, $q, $rootScope) {
				function success(response) {
					return response;
				}

				function error(response) {

					if (response.status === 401) {

						//TODO hard coded, could not use users service because of circlular dependency.
						sessionStorage.removeItem("user");
						$rootScope.user = null;

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
		}]).

		run(['$rootScope', '$location', '$routeParams', 'authState', function ($rootScope, $location, $routeParams, authState) {

			$rootScope.$on("$routeChangeStart", function (event, next, current) {
				$rootScope.error = null;
				logger.log('Route change start', $location.path(), $routeParams);

				//If trying to access auth page not logged in, redirect to login
				if (next.access === access.auth && !authState.isAuth()) {
					$location.path('/login');

				}
				//If trying to access anon page logged in, redirect to groups
				else if (next.access === access.anon && authState.isAuth()) {
					$location.path('/groups');
				}
			});

			$rootScope.$on('$routeChangeSuccess', function (scope, current, pre) {
				logger.log('Route changed', $location.path(), $routeParams);

			});

			authState.refreshUserState();

			$rootScope.appInitialized = true;
		}]);


	//no export
});