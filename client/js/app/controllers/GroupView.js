define(['framework/logger'], function (logger) {

	'use strict';

	var Controller = function ($scope, $http, $location, $routeParams, groupsService) {

		var id = $routeParams.groupId,
			service = groupsService;

		function getGroup() {
			service.findById(id).success(function (data) {
				$scope.group = data;
				$scope.status = 'info';
				//$scope.message = false;
			}).execute();
		}


		function joinGroup() {

			//get group
			service.findById(id).success(function (group) {

				//update count
				group.count = group.count + 1;
				delete group._id; //else update fails

				service.update(id).data(group).execute();

				$scope.group = group;
				$scope.status = 'success';
				$scope.message = 'joined group';

			}).execute();

		}


		function leaveGroup() {
			//get group
			service.findById(id).success(function (group) {

				//update group
				group.count = group.count - 1;
				if (group.count < 0) {
					group.count = 0;
				}
				delete group._id;

				service.update(id).data(group).execute();

				$scope.group = group;
				$scope.status = 'success';
				$scope.message = 'leaved group';
			}).execute();
		}

		$scope.leave = leaveGroup;
		$scope.join = joinGroup;

		getGroup();
	};


	//inject dependencies
	Controller.$inject = ['$scope', '$http', '$location', '$routeParams', 'groupsService'];

	//export
	return Controller;

});
