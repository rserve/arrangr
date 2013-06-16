define(['framework/logger'], function (logger) {

	'use strict';

	var Controller = function ($scope, $filter, $location, $routeParams, groupsClient, $rootScope) {

		var key = $routeParams.groupId,
			client = groupsClient;

		function getGroup() {
			client.findByKey(key,
				function (data) {
					$scope.group = data;
					$scope.status = 'info';
				},
				function (data) {
					$scope.message = "Server says '" + data.error + "'";
					$scope.status = 'error';
				});
		}


		function joinGroup() {

			//get group
			client.findByKey(key,
				function (group) {

					//update count
					group.count = group.count + 1;
					delete group._id; //else update fails

					client.update(key).data(group).execute();

					$scope.group = group;
					$scope.status = 'success';
					$scope.message = 'joined group';

				});

		}


		function leaveGroup() {
			//get group
			client.findByKey(key, function (group) {

				//update group
				group.count = group.count - 1;
				if (group.count < 0) {
					group.count = 0;
				}
				delete group._id;

				client.update(key,group);

				$scope.group = group;
				$scope.status = 'success';
				$scope.message = 'leaved group';
			});
		}

		$scope.leave = leaveGroup;
		$scope.join = joinGroup;

		getGroup();

		$scope.groupCount = {
			0: 'No one have joined',
			1: 'One person have joined.',
			2: 'Two persons have joined.',
			3: 'Three persons have joined.',
			4: 'Four persons have joined.',
			5: 'Five persons have joined.',
			6: 'Six persons have joined.',
			7: 'Seven persons have joined.',
			8: 'Eight persons have joined.',
			9: 'Nine persons have joined.',
			10: 'Ten persons have joined.',
			other: '{} persons have joined.'
		};


	};


	//inject dependencies
	Controller.$inject = ['$scope', '$filter', '$location', '$routeParams', 'groupsClient', '$rootScope'];

	//export
	return Controller;

});
