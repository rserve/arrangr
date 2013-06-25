define(function (require, exports, module) {

	'use strict';

	var baseForm = require('./form/baseForm'),
		fieldFactory = require('./form/fields/fieldFactory');


	var form = baseForm.create();
	form.addField(fieldFactory.createInput({
		validator: 'email',
		name: 'email',
		placeholder: 'Email'
	}));

	form.addField(fieldFactory.createInput({
		validator: 'notEmpty',
		name: 'password',
		placeholder: 'Password.'
	}));


	var Controller = function ($scope, $http, $location, usersClient, authState) {


		//Initialize form, this will bind it to scope
		form.initialize($scope);


		//add hook to field validate
		form.onFieldValidate = function (name, field, error) {


			if (!error) {
				field.setMessage('success', 'OK');
			}
		};

		$scope.submit = function () {

			var errors = form.validateAll();
			if (errors) {



			} else {
				var data = form.toJSON();

				usersClient.login(data,
					function (user) {
						console.log('success', user);

						authState.setUserState(user);

						$location.path("/groups");

						form.reset();
					},
					function (err) {
						console.log('error', err);
						//form.reset();

						form.global.message = err.data.error;
						form.global.status = 'error';


					});
			}

		};


	};

	Controller.$inject = ['$scope', '$http', '$location', 'usersClient', 'authState'];

	module.exports = Controller;

});
