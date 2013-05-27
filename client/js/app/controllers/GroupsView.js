define(['framework/logger'], function (logger) {

	'use strict';

	var Controller = function ($scope, $http) {

        $scope.create = function(group) {
            $http.post('api/groups', group).success(function(data) {
                $scope.groups.push(data);
                group.name = '';
            });
        };

		$http.get('api/groups').success(function (data) {
			logger.log('GroupsView - data received', data);
			$scope.groups = data;
		});
	};

	//export
	return Controller;

});
