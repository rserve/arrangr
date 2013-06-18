define(function (require, exports, module) {

	'use strict';

	//create local validator
	var validator = Object.create(require('services/validator')),
		validators = require('config/validators');

	//add base validators
	validator.addValidators(validators);

	//adding custom validator
	validator.addValidator({
		type: 'password',
		validate: function (value) {
			return value && value.length>5;
		},
		error: {
			key: 'PASSWORD',
			message: "Password must be 6 characters long."
		}
	});

	//different validation rules based on action
	var validatorConfig = {
		login: {
			email: 'email',
			password: 'password'

		},

		register: {
			email: 'email',
			password: 'password'
		}

	};

	var _ = require('underscore');

	var User = function (data) {
		_.extend(this, data);

	};

	var proto = User.prototype;

	proto.validate = function (type) {
		type = type || 'login';

		var data = {
			email: this.email,
			password: this.password
		};
		console.log(data);
		return validator.validate(data, validatorConfig[type]);
	};


	module.exports = User;
});