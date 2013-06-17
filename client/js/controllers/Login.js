define(function (require, exports, module) {

	'use strict';

	var Controller = function ($scope, $http, $location, usersClient, authState) {

		$scope.login = function (user) {

			usersClient.login(user,
				function (user) {
					console.log('success', user);

					authState.setUserState(user);

					$location.path("/groups");
				},
				function (res) {
					console.log('error', res);
					alert('fuck off');
				});

		};


	};

	Controller.$inject = ['$scope', '$http', '$location', 'usersClient', 'authState'];

	module.exports = Controller;

});
