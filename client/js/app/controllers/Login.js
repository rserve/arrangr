define(['framework/logger'], function (logger) {

	'use strict';

	var Controller = function ($scope, $http, $location, users) {

		$scope.login = function (user) {
			users.login().data(user).
				success(function (res) {
					console.log('success', res);

					users.setUserState(user);

					$location.path("/groups");
				}).
				error(function (res) {
					console.log('error', res);
					alert('fuck off');
				}).execute();

		};


	};

	Controller.$inject = ['$scope', '$http', '$location', 'users'];
//export
	return Controller;

})
;
