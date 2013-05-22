'use strict';

define([
	'app',
	'controllers',
	'partials'
], function (app, controllers, partials) {

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

	return routes;
});