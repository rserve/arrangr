define(function (require, exports, module) {

	'use strict';

///////////////////////////////////////////////////
//	DEPENDENCIES
///////////////////////////////////////////////////

	var baseForm = require('framework/form/baseForm');


///////////////////////////////////////////////////
// SETUP FORM
///////////////////////////////////////////////////

	//create a form for this controller
	var form = baseForm.create();


	/*
	 * Add form fields
	 * */

	form.addField({
		name: 'notEmptyInput',
		validator: 'notEmpty',
		group: 'one'
	});


	form.addField({
		name: 'optionalInput',
		group: 'one',
		mandatory: false
	});

	form.addField({
		name: 'customValidatorInput',
		validate: function () {
			var error;
			if (!(/arrange/).test(this.value)) {
				error = {
					key: 'ARRANGE_VALIDATOR',
					message: "I need to contain the word 'arrange'"
				};

			}
			this.error = error;
			return error;
		},

		group: 'one'
	});

	form.addField({
		name: 'passwordInput',
		validator: 'password',
		group: 'two'
	});


	//checkbox field
	form.addField({
		name: 'checkMeCheckbox',
		type: 'checkbox',
		group: 'two',
		checked: false
	});

	//select field
	form.addField({
		name: 'primesSelect',
		type: 'select',
		group: 'two',
		options:[5,10,15,20,25],

		//example of using custom field method
		//TODO fix this with better select implementation
		reset: function () {
			this.error = null;

		},
		//example of using custom field method
		validate: function () {
			var error,
				value = parseInt(this.value, 10);

			if (value < 20) {
				error = {
					key: 'SELECT_ERROR',
					message: "Please select an integer larger than 20."
				};


			}
			this.error = error;

			return error;
		}
	});

///////////////////////////////////////////////////
// ANGULAR CONTROLLER
///////////////////////////////////////////////////


	var Controller = function ($scope) {

		//Initialize form, this will bind it to scope
		form.initialize($scope);


		//expose submit
		$scope.submit = function (status, message) {


			var errors = form.validate();

			form.global.message = JSON.stringify(errors);
			form.global.status = 'error';


		};


		//expose an alert to show form data as example
		$scope.showData = function () {

			var json = form.toJSON();

			alert(JSON.stringify(json));
		};


	};

	Controller.$inject = ['$scope'];

///////////////////////////////////////////////////
// EXPORTS
///////////////////////////////////////////////////


	module.exports = Controller;

});
