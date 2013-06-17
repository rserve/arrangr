define(function (require, exports, module) {

	'use strict';

	var Controller = function ($scope, $filter, $location, $routeParams, groupsClient) {

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

				client.update(key, group);

				$scope.group = group;
				$scope.status = 'success';
				$scope.message = 'leaved group';
			});
		}

		$scope.leave = leaveGroup;
		$scope.join = joinGroup;

		getGroup();


	};

	//inject dependencies
	Controller.$inject = ['$scope', '$filter', '$location', '$routeParams', 'groupsClient', '$rootScope'];

	module.exports = Controller;

});
