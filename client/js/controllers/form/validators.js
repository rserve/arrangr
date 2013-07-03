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

		'password': {
			validate: function (value) {
				return (/((?=.*\d)(?=.*[A-Z]).{6,20})/).test(value);
			},
			error: {
				key: 'WEAK_PASSWORD',
				message: "Password. >6 characters, one digit and one one uppdercase character."
			},
			type: 'password'
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