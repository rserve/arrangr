define(['tools/logger'], function (logger) {

	'use strict';

	var Controller = function ($scope, $http) {

		$http.get('groups').success(function (data) {
			logger.log('GroupsView - data received', data);
			$scope.groups = data;
		});
	};

	//export
	return Controller;

});
