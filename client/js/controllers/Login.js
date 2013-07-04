define(function (require, exports, module) {

	'use strict';

	var baseForm = require('framework/form/baseForm');


	var form = baseForm.create();

	form.addField({
		name: 'email',
		validator: 'notEmpty',
		customError:'You forgot to enter your email address!'
	});

	form.addField({
		name: 'password',
		validator: 'notEmpty',
		customError:'Your password cannot be empty!'
	});



	var Controller = function ($scope, $http, $location, usersClient, authState) {


		//Initialize form, this will bind it to scope
		form.initialize($scope);

		$scope.submit = function () {

			var errors = form.validate();
			if (errors) {
				$scope.error = errors[0].message; // grab only first error

			} else {
				var data = form.toJSON();

				usersClient.login(data,
					function (user) {
						console.log('success', user);

						authState.setUserState(user);

						$location.path("/groups");

						form.clear();
					},
					function (err) {
						console.log('error', err);
						//form.reset();

						$scope.error = err.data.error;



					});
			}

		};


	};

	Controller.$inject = ['$scope', '$http', '$location', 'usersClient', 'authState'];

	module.exports = Controller;

});
