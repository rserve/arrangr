define(function (require, exports, module) {

	'use strict';

	var angular = require('angular');

	var Controller = function ($scope, groupsClient, $rootScope, flash) {
		$scope.model = {};

		function createGroup() {

			if ($scope.form.name.$pristine || $scope.form.name.$invalid) {
				flash.error = 'Name cannot be empty';
			} else {
				groupsClient.create($scope.model,
					function (data) {
						$scope.model = angular.copy({});
						flash.success = 'Meetup created';
						getGroups();
					},
					function (data) {
						flash.error = data.message;
					}
				);
			}
		}

		function deleteGroup(group) {
			groupsClient.delete(group.id, function () {
					flash.success = 'Meetup deleted';
					getGroups();
					getArchive();
				},
				function (data) {
					flash.error = data.message;
				});
		}

		function getGroups() {
			groupsClient.findAll(function (data) {
				$scope.groups = data;
			});
		}

		function getArchive() {
			groupsClient.findArchive(function (data) {
				$scope.archive = data;
			});
		}

		//expose methods to view
		$scope.create = createGroup;
		$scope.delete = deleteGroup;

		$scope.isAdmin = function (group) {
			return group.isAdmin($rootScope.user);
		};

		$scope.member = function (group) {
			return group.member($rootScope.user);
		};

		//default action
		getGroups();
		getArchive();

		$rootScope.title = 'meetups';
	};

	//inject dependencies
	Controller.$inject = ['$scope', 'groupsClient', '$rootScope', 'flash'];

	module.exports = Controller;

});
