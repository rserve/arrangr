define(function (require, exports, module) {

	'use strict';

///////////////////////////////////////////////////
//	DEPENDENCIES
///////////////////////////////////////////////////

	var baseForm = require('./form/baseForm'),
		fieldFactory = require('./form/fields/fieldFactory');

///////////////////////////////////////////////////
// SETUP FORM
///////////////////////////////////////////////////

	//create a form for this controller
	var form = baseForm.create();


	/*
	 * Add form fields
	 * */

	form.addField(fieldFactory.createInput({
		validator: 'notEmpty',
		name: 'notEmptyInput',
		placeholder: 'This cannot be empty',
		group: 'one'
	}));

	form.addField(fieldFactory.createInput({
		validator: 'email',
		name: 'emailInput',
		placeholder: 'This should be an email.',
		group: 'one'
	}));

	form.addField(fieldFactory.createInput({
		name: 'optionalInput',
		placeholder: 'I am optional.',
		group: 'one',
		mandatory: false
	}));

	form.addField(fieldFactory.createInput({

		//example how you can inject custom validator
		validator: {
			validate: function (value) {
				return (/arrange/).test(value);
			},
			error: {
				key: 'ARRANGE_VALIDATOR',
				message: "I need to contain the word 'arrange'"
			},
			type: 'mustContainArrange'
		},
		type: 'text',	//field value
		name: 'customValidatorInput',
		placeholder: 'This is using a custom validator.',
		group: 'one'
	}));

	form.addField(fieldFactory.createInput({
		validator: 'strongPassword',
		type: 'password',	//field value
		name: 'strongPasswordInput',
		placeholder: 'This is a strong password.',
		group: 'one'
	}));


	form.addField(fieldFactory.createInput({
		validator: 'number',
		type: 'number',	//field value
		name: 'numberInput',
		placeholder: 'This must be a number.',
		group: 'one'
	}));

	form.addField(fieldFactory.createInput({
		validator: 'weakPassword',
		type: 'password',	//field value
		name: 'weakPasswordInput',
		placeholder: 'This is a weak password.',
		group: 'two'
	}));


	//checkbox field
	form.addField(fieldFactory.createCheckbox({
		name: 'checkMeCheckbox',
		group: 'two',
		checked: false
	}));

	//select field
	form.addField(fieldFactory.createSelect({
		name: 'primesSelect',
		group: 'two',
		options: [
			2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47
		],
		value: 'Choose a prime...',


		//example of using custom field method
		//TODO fix this with better select implementation
		reset: function () {
			this.value = 'Choose a prime...';
			this.message = null;
			this.status = 0;
		},
		//example of using custom field method
		validate: function () {
			var value = parseInt(this.value, 10);
			if (value < 20) {
				var message = this.message = 'Please select a prime larger than 20.';
				this.status = 'error';

				return {message: message};
			} else {
				this.status = null;
				this.message = null;
			}
		}
	}));

///////////////////////////////////////////////////
// ANGULAR CONTROLLER
///////////////////////////////////////////////////


	var Controller = function ($scope) {

		//Initialize form, this will bind it to scope
		form.initialize($scope);


		//add hook to field validate
		form.onFieldValidate = function (name, field, error) {


			//todo hack to massage select, fix this behavior with better support for selects
			if (name === 'primesSelect' && field.value === 'Choose a prime...') {
				field.reset();
			}
			//hack to massage checkbox, fix this with better support for check boxes
			else if(name === 'checkMeCheckbox' && !field.checked ){
				field.reset();
			}
			//if no error, set a succes and show an "OK" message
			else if (!error) {
				field.setMessage('success', 'OK');
			}
		};


		//expose submit
		$scope.submit = function (status, message) {

			if (!status) {
				form.validateAll();
			} else {


				form.global.message = message;
				form.global.status = status;

			}

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