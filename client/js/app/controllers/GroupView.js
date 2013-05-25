define(['framework/logger'], function (logger) {

	'use strict';

	var Controller = function ($scope, $http, $location, $routeParams) {

		$http.get('groups/' + $routeParams.groupId).success(function (data) {
			logger.log('GroupView - data received', data);
			$scope.group = data;
		});
	};

	//export
	return Controller;

});
