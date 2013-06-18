/*global define*/

define(function (require, exports, module) {

	'use strict';

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
		}
	};

});