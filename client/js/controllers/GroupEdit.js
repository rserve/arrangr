define(function (require, exports, module) {

	'use strict';

	var angular = require('angular');
	var Group = require('../services/api/domain/Group');
	var moment = require('moment');

	var Controller = function ($scope, $state, $stateParams, groupsClient, authState, flash) {

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
//			model.time = $scope.group._time;
//			model.weekday = $scope.group._weekday;
			var start = moment($scope.group.startDate);
			model.startDate = start.format('YYYY-MM-DD');
			model.startTime = start.format('HH:mm');
			var end = moment($scope.group.endDate);
			model.endDate = end.format('YYYY-MM-DD');
			model.endTime = end.format('HH:mm');
			model.minParticipants = $scope.group.minParticipants;
			model.maxParticipants = $scope.group.maxParticipants;
		}

		function mergeDateAndTime(date, time) {
			var d = moment(date);

			if (time) {
				var t = time.split(':');
				d.hours(t[0]).minutes(t[1]);
			}

			return d;
		}

		$scope.update = function () {
			if ($scope.groupForm.$invalid) {
				if ($scope.groupForm.name.$invalid) {
					flash.error = 'Name cannot be empty';
				} else {
					flash.error = 'Please check form.';
				}

			} else {

				$scope.groupModel.startDate = mergeDateAndTime($scope.groupModel.startDate, $scope.groupModel.startTime);
				delete $scope.groupModel.startTime;
				$scope.groupModel.endDate = mergeDateAndTime($scope.groupModel.endDate, $scope.groupModel.endTime);
				delete $scope.groupModel.endTime;

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
	Controller.$inject = ['$scope', '$state', '$stateParams', 'groupsClient', 'authState', 'flash'];

	module.exports = Controller;

});
