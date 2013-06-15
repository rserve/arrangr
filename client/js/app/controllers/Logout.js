define(['framework/logger'], function (logger) {

	'use strict';

	var Controller = function ($scope, $http, $location, users) {


		users.logout().
			success(function (res) {
				console.log('success', res);
				sessionStorage.removeItem("user");
				$location.path("/login");
			}).
			error(function (res) {
				console.log('error', res);
				alert('logout failed, fuck off');
			}).execute();
	};

	Controller.$inject = ['$scope', '$http', '$location', 'users'];
//export
	return Controller;

})
;
