define([
	'app/app',
	'app/controllers/controllers',
	'app/partials',
	'framework/logger'
], function (app, controllers, partials, logger) {

	'use strict';

	app.

		//configure routes
		config(['$routeProvider', function ($routeProvider) {

			$routeProvider.

				//view group
				when('/groups/:groupId', {
					templateUrl: partials.group,
					controller: 'GroupView'
				}).

				//view groups
				when('/groups', {
					templateUrl: partials.groups,
					controller: 'GroupsView'
				}).

				//default to group listing
				otherwise({redirectTo: '/groups'});
		}]).

		//listen to route changes
		run(['$rootScope', '$location', '$routeParams', function ($rootScope, $location, $routeParams) {
			$rootScope.$on('$routeChangeSuccess', function (scope, current, pre) {
				logger.log('Route changed', $location.path(), $routeParams);

			});
		}]);

	//no export
});