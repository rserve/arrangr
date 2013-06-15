define(['framework/logger'], function (logger) {

	'use strict';

	var Controller = function ($scope, $filter, $location, $routeParams, groupsService, users) {


		var group = $routeParams.group,
			email = $routeParams.email;


		function joinGroup() {
			groupsService.join(group).
				success(function () {
					$location.path("/group/" + group);
				}).
				error(function (res) {
					console.log('error', res);
					alert('fuck off');

				}).
				execute();
		}

		users.login().data({email: email, password: 'bajs'}).
			success(function (user) {
				users.setUserState(user);

				joinGroup();

			}).
			error(function (res) {
				console.log('error', res);
				alert('fuck off');

			}).execute();


	};


	//inject dependencies
	Controller.$inject = ['$scope', '$filter', '$location', '$routeParams', 'groupsService', 'users'];

	//export
	return Controller;

});
