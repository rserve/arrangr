define(function (require, exports, module) {

	'use strict';

	var Controller = function ($scope, $filter, $location, $routeParams, groupsClient, usersClient) {


		var group = $routeParams.groupId,
			email = $routeParams.email;


		function joinGroup() {
			groupsClient.join(group,
				function () {
					$location.path("/groups/" + group);
				},
				function (res) {
					console.log('error', res);
					if (res.status === 409) {
						$location.path("/groups/" + group);
					} else {
						alert('fuck off');

					}
				});
		}

		var form = {email: email, password: 'bajs'};

		var saveUserAndJoinGroup = function (user) {
			usersClient.setUserState(user);

			joinGroup();

		};
		usersClient.login(form,
			saveUserAndJoinGroup,
			function (res) {
				console.log('error', res);
				if (res.status === 404) {
					register();
				} else {

					alert('fuck off');
				}

			});

		function register() {
			usersClient.create(form,saveUserAndJoinGroup,
				function (res) {
					console.log('error', res);
					alert('registration failed, fuck off');
				});
		}

	};


	//inject dependencies
	Controller.$inject = ['$scope', '$filter', '$location', '$routeParams', 'groupsClient', 'usersClient'];

	//export
	module.exports = Controller;

});
