define(['framework/logger'], function (logger) {

	'use strict';

	var Controller = function ($scope, $http, $location, $routeParams, groupsService) {

		//success
		var cb = function (data) {
			logger.log('GroupView - data received', data);
			$scope.group = data;
		};

		groupsService.findById($routeParams.groupId).success(cb).execute();

	};

	//inject dependencies
	Controller.$inject = ['$scope', '$http', '$location', '$routeParams', 'groupsService'];

	//export
	return Controller;

});
