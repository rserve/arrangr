define(function (require, exports, module) {

	'use strict';

	var app = require('app'),
		partials = require('./partials');

	//access levels
	var access = {
		public: 1,
		anon: 2,
		auth: 3
	};

	app.
		config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

			//push state
			$locationProvider.html5Mode(true);

			//Routes
			$routeProvider.
				when('/groups/:groupId', {
					templateUrl: partials.group,
					controller: 'Group',
					access: access.public
				}).
				when('/groups', {
					templateUrl: partials.groups,
					controller: 'Groups',
					access: access.auth
				}).
				when('/logout', {
					templateUrl: partials.empty,
					controller: 'Logout',
					access: access.auth
				}).
                when('/verify/:verificationHash', {
                    templateUrl: partials.verify,
                    controller: 'Verify',
                    access: access.public
                }).
				when('/demo-form', {
					templateUrl: partials.demoForm,
					controller: 'DemoForm',
					access: access.public
				}).
				when('/', {
					templateUrl: partials.home,
					controller: 'Home',
					access: access.anon
				}).
				otherwise({
                    templateUrl: partials.notFound
                });

			console.log('Routes configured');

		}]).

		run(['$rootScope', '$location', '$routeParams', 'authState', function ($rootScope, $location, $routeParams, authState) {

			$rootScope.$on("$routeChangeStart", function (event, next, current) {
				$rootScope.error = null;

				//If trying to access authenticated page not logged in, redirect to home
				if (next.access === access.auth && !authState.isAuth()) {
					$location.path('/home');
				}
				//If trying to access anonymous page logged in, redirect to groups
				else if (next.access === access.anon && authState.isAuth()) {
					$location.path('/groups');
				}
			});

			$rootScope.$on('$routeChangeSuccess', function (scope, current, pre) {
				console.log('Route changed', $location.path(), $routeParams);

			});

			console.log('Route intercepts configured');

		}]);

	module.exports = app;
});
