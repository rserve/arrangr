define(['framework/logger'], function (logger) {

	'use strict';

	var Controller = function ($scope, $http, groupsService) {

		$scope.create = function (group) {

			var cb = function (data) {
				$scope.groups.push(data);
				group.name = '';
			};

			groupsService.create().data(group).success(cb).execute();

		};

		var cb = function (data) {
			logger.log('GroupsView - data received', data);
			$scope.groups = data;
		};

		$scope.delete = function (group) {

			groupsService.delete(group._id).execute();
			groupsService.findAll().success(cb).execute();
		};


		groupsService.findAll().success(cb).execute();

	};

	//inject dependencies
	Controller.$inject = ['$scope', '$http', 'groupsService'];

	//export
	return Controller;

});
