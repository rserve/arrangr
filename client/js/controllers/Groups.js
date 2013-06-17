define(function (require, exports, module) {

	'use strict';

	var Controller = function ($scope, $filter, $location, $routeParams, groupsClient, $rootScope) {

		function createGroup(group) {
			if (!group || !group.name) {
				$scope.message = 'Name cannot be empty.';
			} else {
				$scope.message = '';

				groupsClient.create(group,function (data) {
					group.name = '';
					$scope.groups.push(data);
				});
			}
		}

		function deleteGroup(group) {
			groupsClient.delete(group.key);

			getGroups();
		}

		function getGroups() {
			groupsClient.findAll(function (data) {
				$scope.groups = data;
			});
		}


		//expose methods to view
		$scope.create = createGroup;
		$scope.delete = deleteGroup;
		$scope.refresh = getGroups;

		$scope.isAdmin = function (group) {
			return group.isAdmin($rootScope.user);
		};

		//default action
		getGroups();

	};

	//inject dependencies
	Controller.$inject = ['$scope', '$filter', '$location', '$routeParams', 'groupsClient', '$rootScope'];

	module.exports = Controller;

});
