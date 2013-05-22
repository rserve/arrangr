define(['tools/logger'], function (logger) {

	'use strict';

	var Controller = function ($scope, $http) {

		$http.get('data/groups.json').success(function (data) {
			logger.log('GroupsView - data received', data);
			$scope.groups = data;
		});
	};

	//export
	return Controller;

});
