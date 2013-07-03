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
				message: "Value can't be empty!"
			},
			type: 'notEmpty'
		},
		'email': {
			validate: function (value) {
				return (/\S+@\S+\.\S+/).test(value);
			},
			error: {
				key: 'EMAIL',
				message: "Please provide emial."
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