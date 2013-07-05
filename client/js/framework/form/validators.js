/*
 * validators.js
 *
 * Validators for form fields (or any strings).
 *
 *
 * */

define(function (require, exports, module) {

	'use strict';

	//TODO type shouldn't have to be kept on two levels

	module.exports = {
		'notEmpty': {
			validate: function (value) {
				return !!value;
			},
			error: {
				key: 'NOT_EMPTY',
				message: "Value can't be empty!"
			},
			type: 'notEmpty'
		},

		'email': {
			validate: function (value) {
				return (/\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}\b/).test(value);
			},
			error: {
				key: 'EMAIL',
				message: "Please provide email."
			},
			type: 'email'
		},

		'password': {
			validate: function (value) {
				return (/((?=.*\d)(?=.*[A-Z]).{6,20})/).test(value);
			},
			error: {
				key: 'PASSWORD',
				message: "Password must be at least 6 characters and contain one digit and one one uppercase character."
			},
			type: 'password'
		}
	};

});