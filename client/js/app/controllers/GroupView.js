define(['framework/logger'], function (logger) {

	'use strict';

	var Controller = function ($scope, $http, $location, $routeParams, groupsService) {

		var id = $routeParams.groupId,
			action = $routeParams.action,
			service = groupsService;

		//success
		function cb(data) {
			logger.log('GroupView - data received', data);
			$scope.group = data;
		}

		var actions = {
			show: function () {
				service.findById(id).success(cb).execute();
			},
			join: function () {
				var group = service.findById(id).success(cb).execute();
				service.update(id).data(group).success(cb).execute();
			},
			delete: function () {
				service.delete(id).success(cb).execute();
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
