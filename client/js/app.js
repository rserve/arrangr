angular.module('rserve', []).
	config(['$routeProvider', function ($routeProvider) {
		$routeProvider.
			when('/groups/:groupId', {templateUrl: 'partials/group.html', controller: GroupViewController}).
			otherwise({redirectTo: '/groups'});
	}]);