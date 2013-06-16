define(function (require, exports, module) {

	'use strict';

	var Controller = function ($scope, $http, $location, usersClient, authState) {


		$scope.signUp = function (user) {
			usersClient.create(user,
				function (res) {
					console.log('success', res);
					authState.setUserState(res);
					$location.path("/groups");
				},
				function (res) {
					console.log('error', res);
					alert('registration failed, fuck off');
				});

		};

	};

	Controller.$inject = ['$scope', '$http', '$location', 'usersClient', 'authState'];
	//export
	module.exports = Controller;

});
