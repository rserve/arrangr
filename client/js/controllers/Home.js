/*
 * Home.js
 *
 * Home controller, entry page for users. Provide both register and login form.
 *
 * */
define(function (require, exports, module) {

	'use strict';

	var baseForm = require('framework/form/baseForm');

	/*
	 * Create login form
	 * */

	//TODO get phrases from config
	var loginForm = baseForm.create().
		addField({
			name: 'email',
			validator: 'notEmpty',
			customError: 'You forgot to enter your email!'
		}).

		addField({
			name: 'password',
			validator: 'notEmpty',
			customError: 'Your password cannot be empty!'
		});

	/*
	 * Create register form
	 * */

	//TODO get phrases from config
	var registerForm = baseForm.create()
		.addField({
			name: 'email',
			validator: 'email',
			customError: 'Please check entered email address!'
		}).
		addField({
			name: 'password',
			validator: 'password'
			//customError: 'Your password cannot be empty!'
		});


	/*
	 * Angular controller
	 * */
	var Controller = function ($scope, $state, usersClient, authState) {

		//bind the two forms under different namespaces
		loginForm.initialize($scope, 'loginForm');
		registerForm.initialize($scope, 'registerForm');

        $scope.home = true;


		/*
		 * Login form
		 * */

		$scope.showLogin = function () {

			$scope.isLogin = true;

			// we reset form when showing it instead of when hiding it because
			// form is hidden behind "flipper"
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

                            $state.transitionTo("groups");

							loginForm.clear();
						},
						function (err) {
							console.log('error', err);

							$scope.loginError = err.message;

						});
				}

			};
		};

		/*
		 * Register form
		 * */

		$scope.showRegister = function () {

			$scope.isLogin = false;
			registerForm.clear();

			// we reset form when showing it instead of when hiding it because
			// form is hidden behind "flipper"
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
							$state.transitionTo("groups");
							registerForm.clear();
						},
						function (err) {
							console.log('error', err);
							$scope.registerError = err.message;

						});
				}

			};
		};

		//show register as default
		$scope.showLogin();


	};

	Controller.$inject = ['$scope', '$state', 'usersClient', 'authState'];

	module.exports = Controller;

});
