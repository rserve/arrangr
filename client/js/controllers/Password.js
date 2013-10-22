define(function (require, exports, module) {

	'use strict';

	var angular = require('angular');

	var Controller = function ($scope, $http, $state, $stateParams, usersClient, authState, flash) {

		var hash = $stateParams.hash;

		$scope.model = angular.copy({});

		$scope.submit = function () {
			if ($scope.form.password.$invalid) {
				flash.error = 'Password must be at least 6 characters.';
			} else if ($scope.model.password !== $scope.model.password2) {
				flash.error = 'Passwords must match';
			} else {
				usersClient.password({ hash: hash, password: $scope.model.password },
					function (user) {
						flash.success = 'Your password has been set successfully.';
						authState.setUserState(user);
						$state.transitionTo('groups');
					},
					function (data) {
						flash.duration = 0;
						flash.error = data.message;
					}
				);
			}
		};
	};

	Controller.$inject = ['$scope', '$http', '$state', '$stateParams', 'usersClient', 'authState', 'flash'];


	module.exports = Controller;

});