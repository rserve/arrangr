/*
 * Home.js
 *
 * Home controller, entry page for users. Provide both register and login form.
 *
 * */
define(function (require, exports, module) {

	'use strict';

	var angular = require('angular');

	var Controller = function ($scope, $rootScope, $state, usersClient, authState) {

		$scope.login = function () {

			var form = $scope.loginForm;
			var email = form.email;
			var password = form.password;

			if (email.$pristine || email.$invalid) {
				$scope.loginModel.error = "You forgot to enter your email!";
			} else if (password.$pristine || password.$invalid) {
				$scope.loginModel.error = 'Your password cannot be empty!';
			} else {

				// we could use loginMode here also for data, but it contains error message
				usersClient.login({
						email: email.$viewValue,
						password: password.$viewValue
					},
					function (user) {
						authState.setUserState(user);
						if($rootScope.redirectTo) {
							$state.transitionTo($rootScope.redirectTo.to, $rootScope.redirectTo.toParam);
						} else {
							$state.transitionTo("groups");
						}
					},
					function (err) {
						$scope.loginModel.error = err.message;
					});
			}
		};

		$scope.register = function () {

			var form = $scope.registerForm;
			var email = form.email;

			if (email.$pristine || email.$invalid) {
				$scope.registerModel.error = "Please check entered email address!";
			} else {

				// we could use registerModel here also for data, but it contains error message
				usersClient.create({
						email: email.$viewValue
					},
					function (res) {
						$scope.registerModel.success = 'Verification email sent!';
					},
					function (err) {
						if(err.name == 'ValidationError' && err.errors.email) {
							$scope.registerModel.error = err.errors.email.type;
						} else {
							$scope.registerModel.error = err.message;
						}
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

		$scope.forgotPassword = function() {
			usersClient.password({email: $scope.loginModel.email },
				function() {
					$scope.loginModel.error = null;
					$scope.loginModel.success = 'Email sent!';
				},
				function(err) {
					$scope.loginModel.error = err.message;
				}
			);
		};

		//show register as default
		$scope.showLogin();


	};

	Controller.$inject = ['$scope', '$rootScope', '$state', 'usersClient', 'authState'];

	module.exports = Controller;

});
