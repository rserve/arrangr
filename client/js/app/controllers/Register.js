define(['framework/logger'], function (logger) {

	'use strict';

	var Controller = function ($scope, $http, $location, users) {


		$scope.signUp = function (user) {
			users.create().data(user).
				success(function (res) {
					console.log('success', res);
					users.setUserState(res);
					$location.path("/groups");
				}).
				error(function (res) {
					console.log('error', res);
					alert('registration failed, fuck off');
				}).execute();

		};

	};

	Controller.$inject = ['$scope', '$http', '$location', 'users'];
//export
	return Controller;

})
;
