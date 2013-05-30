define(['framework/logger'], function (logger) {

	'use strict';

	var Controller = function ($scope, $http, $location, $routeParams, groupsService) {

		var id = $routeParams.groupId,
			action = $routeParams.action,
			service = groupsService;


		var actions = {
			show: function () {

				service.findById(id).success(function (data) {
					$scope.group = data;
					$scope.status = 'info';
					$scope.action = $routeParams.action;
				}).execute();
			},
			join: function () {

				//get group
				service.findById(id).success(function (group) {

					//update group
					group.count = group.count + 1;
					delete group._id;

					service.update(id).data(group).execute();

					$scope.group = group;
					$scope.status = 'success';
					$scope.action = $routeParams.action;
				}).execute();

			}
		};

		//run action
		actions[action]();

	};

	//inject dependencies
	Controller.$inject = ['$scope', '$http', '$location', '$routeParams', 'groupsService'];

	//export
	return Controller;

});
