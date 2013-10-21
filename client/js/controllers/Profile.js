define(function (require, exports, module) {

	'use strict';

	var Controller = function ($scope, $rootScope, $state, $stateParams, usersClient, authState, flash) {


		function clearForm() {
			$scope.model = angular.copy({});
			$scope.model.name = $rootScope.user.name;
			$scope.model.gravatar = $rootScope.user.gravatar;
		}

		clearForm();

		$scope.save = function () {


			if ($scope.form.password.$invalid || $scope.form.password2.$invalid) {
				flash.error = 'Password must be at least 6 characters.';
			} else if ($scope.model.password !== $scope.model.password2) {
				flash.error = 'Passwords must match';
			} else {

				var data = $scope.model;

				usersClient.update($rootScope.user.id, data,
					function (user) {
						authState.setUserState(user);
						flash.success = 'Profile updated';
						clearForm();
					},
					function (data) {
						flash.error = data.message;
					}
				);
			}
		};

	};

	Controller.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'usersClient', 'authState', 'flash'];


	module.exports = Controller;

});