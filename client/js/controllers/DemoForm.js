define(function (require, exports, module) {

	'use strict';

///////////////////////////////////////////////////
//	DEPENDENCIES
///////////////////////////////////////////////////

	var baseForm = require('./form/baseForm');


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
		name: 'emailInput',
		validator: 'email',
		group: 'one'
	});

	form.addField({
		name: 'optionalInput',
		group: 'one',
		mandatory: false
	});

	form.addField({
		name: 'customValidatorInput',
		validate : function (){
			if(!(/arrange/).test(this.value)){
				var error = {key: 'ARRANGE_VALIDATOR',
					message: "I need to contain the word 'arrange'"
				};
				this.setMessage('error', error.message);
				return error;
			}
		},

		group: 'one'
	});

	form.addField({
		name: 'strongPasswordInput',
		validator: 'strongPassword',
		group: 'one'
	});


	form.addField({
		name: 'numberInput',
		validator: 'number',
		group: 'one'
	});

	form.addField({
		name: 'weakPasswordInput',
		validator: 'weakPassword',
		group: 'two'
	});


	//checkbox field
	form.addField({
		name: 'checkMeCheckbox',
		type:'checkbox',
		group: 'two',
		checked: false
	});

	//select field
	form.addField({
		name: 'primesSelect',
		type:'select',
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
	});

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
			else if (name === 'checkMeCheckbox' && !field.checked) {
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
				form.validate();
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
