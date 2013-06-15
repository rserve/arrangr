define(['framework/logger'], function (logger) {

	'use strict';

	var Controller = function ($scope, $filter, $location, $routeParams, groupsService, $rootScope) {

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

		function getUserDetail() {
			$scope.email = JSON.parse(sessionStorage.getItem("user")).email;
		}

		//expose methods to view
		$scope.create = createGroup;
		$scope.delete = deleteGroup;
		$scope.refresh = getGroups;


		//default action
		getGroups();
		getUserDetail();

		$scope.isAdmin = function (group) {
			var user = $rootScope.user;
			for (var i = 0, len = group.members.length; i < len; i++) {
				var member = group.members[i];
				if (member.user === user._id && member.admin) {
					return true;
				}
			}
			return false;
		};

	};


	//inject dependencies
	Controller.$inject = ['$scope', '$filter', '$location', '$routeParams', 'groupsService', '$rootScope'];

	//export
	return Controller;

});
