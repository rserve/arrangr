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
		config(['$stateProvider', '$locationProvider', function ($stateProvider, $locationProvider) {

			//push state
			$locationProvider.html5Mode(true);

            $stateProvider
                .state('home', {
                    url: '/',
                    controller: 'Home',
                    templateUrl: partials.home,
                    access: access.anon
                })
                .state('default', {
                    abstract: true,
                    templateUrl: partials.layout
                })
                .state('groups', {
                    url: '/groups',
                    parent: 'default',
                    controller: 'Groups',
                    templateUrl: partials.groups,
                    access: access.auth
                })
                .state('group', {
                    url: '/groups/:groupId',
                    parent: 'default',
                    controller: 'Group',
                    templateUrl: partials.group,
                    access: access.public
                })
                .state('logout', {
                    url: '/logout',
                    controller: 'Logout',
                    access: access.auth
                });

			//Routes
			/*$routeProvider.
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
                });*/

			console.log('Routes configured');

		}])

        .run(['$rootScope', '$state', '$stateParams', 'authState', function ($rootScope, $state, $stateParams, authState) {

			$rootScope.$on("$stateChangeStart", function (event, to, toParam, from, fromParams) {
				$rootScope.error = null;

				//If trying to access authenticated page not logged in, redirect to home
				if (to.access === access.auth && !authState.isAuth()) {
                    event.preventDefault();
					$state.transitionTo('home');
				}
				//If trying to access anonymous page logged in, redirect to groups
				else if (to.access === access.anon && authState.isAuth()) {
                    event.preventDefault();
					$state.transitionTo('groups');
				}
			});

			console.log('Route intercepts configured');
		}]);

	module.exports = app;
});
