define(function (require, exports, module) {

	'use strict';

	var User = require('services/api/domain/User');

	function createErrorMessage(errors) {
		var errs = errors.map(function (error) {
			return error.message;
		});

		return errors.join(', ');
	}

	var Controller = function ($scope, $http, $location, usersClient, authState) {

		function prepareForm() {
			$scope.user = new User();
		}

		$scope.login = function (user) {

			var errors = user.validate('login');
			if (errors) {
				console.log('Errors in login form: ', errors);
				var message = createErrorMessage(errors);
				$scope.error = message;
			} else {

				usersClient.login(user,
					function (user) {
						console.log('success', user);

						authState.setUserState(user);

						$location.path("/groups");
					},
					function (err) {
						console.log('error', err);
						$scope.error = err.data.error;
						prepareForm();
					});
			}

		};

		prepareForm();


	};

	Controller.$inject = ['$scope', '$http', '$location', 'usersClient', 'authState'];

	module.exports = Controller;

});
