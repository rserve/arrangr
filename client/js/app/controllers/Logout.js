define(['framework/logger'], function (logger) {

	'use strict';

	var Controller = function ($scope, $http, $location, usersClient, authState) {


		usersClient.logout(function (res) {
				console.log('success', res);
				authState.removeUserState();
				$location.path("/login");
			},
			function (res) {
				console.log('error', res);
				alert('logout failed, fuck off');
			});
	};

	Controller.$inject = ['$scope', '$http', '$location', 'usersClient','authState'];
//export
	return Controller;

})
;
