'use strict';

define([
	'app',
	'controllers',
	'partials',
	'tools/logger'
], function (app, controllers, partials, logger) {

	var routes = app.
		config(['$routeProvider', function ($routeProvider) {

			$routeProvider.

				//view group
				when('/groups/:groupId', {
					templateUrl: partials.group,
					controller: 'GroupView'
				}).

				//default to group listing
				otherwise({redirectTo: '/groups'});
		}]);

	app
		.run(['$rootScope','$location', '$routeParams', function($rootScope, $location, $routeParams) {
			$rootScope.$on('$routeChangeSuccess', function(scope, current, pre) {
				logger.log('Getting route', $location.path(),$routeParams);

			});
		}]);

	return routes;
});