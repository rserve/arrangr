define(function (require, exports, module) {

	'use strict';

	var baseForm = require('framework/form/baseForm'),
		loginForm = baseForm.create();


	loginForm.addField({
		name: 'email',
		validator: 'notEmpty',
		customError: 'You forgot to enter your email address!'
	});

	loginForm.addField({
		name: 'password',
		validator: 'notEmpty',
		customError: 'Your password cannot be empty!'
	});


	var registerForm = baseForm.create();

	registerForm.addField({
		name: 'email',
		validator: 'email',
		customError: 'Please check entered email address!'
	});

	registerForm.addField({
		name: 'password',
		validator: 'password'
		//customError: 'Your password cannot be empty!'
	});

	var Controller = function ($scope, $http, $location, usersClient, authState) {

		//bind the two forms under different namespaces
		loginForm.initialize($scope, 'loginForm');
		registerForm.initialize($scope, 'registerForm');


		$scope.showLogin = function () {

			$scope.isLogin = true;
			loginForm.clear();
			$scope.loginError = null;

			//rebind submit
			$scope.submit = function () {

				var errors = loginForm.validate();
				if (errors) {
					$scope.loginError = errors[0].message; // grab only first error

				} else {
					var data = loginForm.toJSON();

					usersClient.login(data,
						function (user) {
							console.log('success', user);

							authState.setUserState(user);

							$location.path("/groups");

							loginForm.clear();
						},
						function (err) {
							console.log('error', err);

							$scope.loginError = err.data.message;

						});
				}

			};
		};

		$scope.showRegister = function () {

			$scope.isLogin = false;
			registerForm.clear();
			$scope.registerError = null;

			//rebind submit
			$scope.submit = function () {

				var errors = registerForm.validate();
				if (errors) {
					$scope.registerError = errors[0].message; // grab only first error

				} else {
					var data = registerForm.toJSON();

					usersClient.create(data,
						function (res) {
							console.log('success', res);
							authState.setUserState(res);
							$location.path("/groups");
							registerForm.clear();
						},
						function (err) {
							console.log('error', err);
							$scope.registerError = err.data.message;

						});
				}

			};
		};

		//show register as default
		$scope.showRegister();


	};

	Controller.$inject = ['$scope', '$http', '$location', 'usersClient', 'authState'];

	module.exports = Controller;

});
