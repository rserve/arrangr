define(['framework/logger'], function (logger) {

	'use strict';

	var Controller = function ($scope, $http, groupsService) {

		function createGroup(group) {
			if (!group || !group.name) {
				$scope.message = 'Name cannot be empty.';
			} else {
				$scope.message = '';

				groupsService.create().data(group).success(function (data) {

					group.name = '';
					$scope.groups.push(data);
				}).execute();
			}
		}

		function deleteGroup(group) {
			groupsService.delete(group.key).execute();

			getGroups();
		}

		function getGroups() {
			groupsService.findAll().success(function (data) {

				logger.log('GroupsView.getGroups()', data);
				$scope.groups = data;

			}).execute();
		}

		//expose methods to view
		$scope.create = createGroup;
		$scope.delete = deleteGroup;
		$scope.refresh = getGroups;


		//default action
		getGroups();
	};

	//inject dependencies
	Controller.$inject = ['$scope', '$http', 'groupsService', 'users'];

	//export
	return Controller;

});
