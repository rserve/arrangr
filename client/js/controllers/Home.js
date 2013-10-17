/*
 * Home.js
 *
 * Home controller, entry page for users. Provide both register and login form.
 *
 * */
define(function (require, exports, module) {

	'use strict';

	var angular = require('angular');

	var Controller = function ($scope, $state, usersClient, authState) {

		$scope.login = function () {

			var form = $scope.loginForm;
			var email = form.email;
			var password = form.password;

			if (email.$pristine || email.$invalid) {
				$scope.loginModel.error = "You forgot to enter your email!";
			} else if (password.$pristine || password.$invalid) {
				$scope.loginModel.error = "Your password cannot be empty!";
			} else {

				// we could use loginMode here also for data, but it contains error message
				usersClient.login({
						email: email.$viewValue,
						password: password.$viewValue
					},
					function (user) {
						authState.setUserState(user);
						$state.transitionTo("groups");
					},
					function (err) {
						console.log('error', err);
						$scope.loginModel.error = err.message;
					});
			}
		};

		$scope.register = function () {

			var form = $scope.registerForm;
			var email = form.email;
			var password = form.password;

			if (email.$pristine || email.$invalid) {
				$scope.registerModel.error = "Please check entered email address!";
			} else if (password.$pristine || password.$invalid) {
				$scope.registerModel.error = "Password must be at least 6 characters.";
			} else {

				// we could use registerModel here also for data, but it contains error message
				usersClient.create({
						email: email.$viewValue,
						password: password.$viewValue
					},
					function (res) {
						authState.setUserState(res);
						$state.transitionTo("groups");
					},
					function (err) {
						console.log('error', err);
						$scope.registerModel.error = err.message;
					});
			}
		};


		// split into two models to keep "flip" animation smooth (only clear hidden form)
		$scope.showLogin = function () {
			$scope.isLogin = true;
			$scope.loginModel = angular.copy({});
		};

		$scope.showRegister = function () {
			$scope.isLogin = false;
			$scope.registerModel = angular.copy({});
		};

		//show register as default
		$scope.showLogin();


	};

	Controller.$inject = ['$scope', '$state', 'usersClient', 'authState'];

	module.exports = Controller;

});
