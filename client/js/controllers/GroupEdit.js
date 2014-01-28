define(function (require, exports, module) {

	'use strict';

	var angular = require('angular');
	var Group = require('../services/api/domain/Group');

	var Controller = function ($scope, $state, $stateParams, groupsClient, authState, flash, socket) {

		var key = $stateParams.groupId,
			client = groupsClient;

		function updateGroup(data) {
			$scope.group = data;
			resetGroupModel();
		}

		function getGroup() {
			client.findByKey(key,
				function (group) {
					updateGroup(group);
					$scope.currentMember = group.member($scope.user);

				},
				function (data) {
					flash.error = data.message;
				});
		}

		function resetGroupModel() {
			var model = $scope.groupModel = angular.copy({});
			model.name = $scope.group.name;
			model.description = $scope.group.description;
			model.public = $scope.group.public;
			model.time = $scope.group._time;
			model.weekday = $scope.group._weekday;
		}

		// why are we doing like this?
		function calculateStartDate() {
			var startDate = $scope.group.startDate ? new Date($scope.group.startDate) : new Date();

			var weekday = $scope.groupModel.weekday;
			if (weekday) {
				var current = $scope.group.weekday() || new Date().getDay();
				var diff = current - weekday;
				startDate.setDate(startDate.getDate() - diff);
			}

			var time = $scope.groupModel.time;

			if ($scope.groupModel.time) {
				var t = time.split(':');
				startDate.setHours(t[0]);
				startDate.setMinutes(t[1]);
			}

			return startDate;
		}


		$scope.update = function () {

			if ($scope.groupForm.$invalid) {
				if ($scope.groupForm.name.$invalid) {
					flash.error = 'Name cannot be empty';
				} else {
					flash.error = 'Please check form.';
				}

			} else {

				$scope.groupModel.startDate = calculateStartDate();

				client.update(key, $scope.groupModel,
					function (data) {
						updateGroup(data);
						flash.success = 'Meetup updated';
					},
					function (data) {
						flash.error = data.message;
					});
			}
		};


		$scope.increment = function () {
			client.increment(key,
				function (data) {
					updateGroup(data);
					flash.success = 'Meetup updated to next cycle';
				},
				function (data) {
					flash.error = data.message;
				});
		};


		getGroup();
	};

	//inject dependencies
	Controller.$inject = ['$scope', '$state', '$stateParams', 'groupsClient', 'authState', 'flash', 'socket'];

	module.exports = Controller;

});
