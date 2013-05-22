'use strict';
define([], function () {

	var Controller = function ($scope, $http) {

		$http.get('data/group.json').success(function (data) {
			$scope.group = data;
		});
	};

	return Controller;

});
