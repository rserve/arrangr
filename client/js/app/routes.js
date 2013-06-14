define([
	'app/app',
	'app/controllers/controllers',
	'app/partials',
	'framework/logger'
], function (app, controllers, partials, logger) {

	'use strict';

	app.

		//configure routes
		config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
            $locationProvider.html5Mode(true);
			$routeProvider.

				when('/groups/:groupId', {
					templateUrl: partials.group,
					controller: 'GroupView'
				}).
				when('/groups/:groupId/:action', {
					templateUrl: partials.group,
					controller: 'GroupView'
				}).

				when('/groups', {
					templateUrl: partials.groups,
					controller: 'GroupsView'
				}).

                when('/', {
                    templateUrl: partials.home,
                    controller: 'Home'
                }).

				//default to group listing
				otherwise({redirectTo: '/'});
		}]).

		//listen to route changes
		run(['$rootScope', '$location', '$routeParams', function ($rootScope, $location, $routeParams) {
			$rootScope.$on('$routeChangeSuccess', function (scope, current, pre) {
				logger.log('Route changed', $location.path(), $routeParams);

			});
		}]);

	//no export
});