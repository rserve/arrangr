/*global define*/

define(function (require, exports, module) {

	'use strict';
	var _ = require('underscore');

	module.exports = {
		'notEmpty': {
			validate: function (value) {
				return !!value;
			},
			error: {
				key: 'NOT_EMPTY',
				message: "Value can't be empty"
			},
			type: 'notEmpty'
		},
		'email': {
			validate: function (value) {
				return (/\S+@\S+\.\S+/).test(value);
			},
			error: {
				key: 'EMAIL',
				message: "Email is malformed."
			},
			type: 'email'
		},
		'strongPassword': {
			validate: function (value) {
				return (/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/).test(value);
			},
			error: {
				key: 'STRONG_PASSWORD',
				message: "We require a strong password. 6-20 characters, one digit, one lowercase, one uppdercase and one special character (@#$%)"
			},
			type: 'strongPassword'
		},
		'weakPassword': {
			validate: function (value) {
				return (/((?=.*\d)(?=.*[A-Z]).{6,20})/).test(value);
			},
			error: {
				key: 'WEAK_PASSWORD',
				message: "We require a weak password. >6 characters, one digit and one one uppdercase character."
			},
			type: 'weakPassword'
		},
		'number': {
			validate: function (value) {
				return (/^\d+$/).test(value);
			},
			error: {
				key: 'NUMBER',
				message: "This must be a number."
			},
			type: 'number'
		}
	};

});