define(function (require, exports, module) {

	'use strict';

	var _ = require('underscore');

	module.exports = {

		config: {},
		validators: {},
		errors: [],

		addConfig: function (config) {
			_.extend(this.config, config);
		},

		addValidator: function (validator) {
			this.validators[validator.type] = validator;
		},

		addValidators: function (validators) {
			for (var type in validators) {
				if (validators.hasOwnProperty(type)) {
					var validator = validators[type];
					this.validators[validator.type] = validator;
				}
			}
		},

		validate: function (data, config) {

			var param,
				value,
				type,
				error,
				errors;

			for (param in data) {
				errors = errors || {};
				if (data.hasOwnProperty(param)) {
					value = data[param];

					//can override config per validate call
					type = config ? config[param] : this.config[param];

					error = this.validateField(type, value);

					if (error) {
						errors[param] = error;
					}
				}
			}

			return errors;
		},

		validateField: function (type, value) {
			var validator = this.validators[type];

			if (!validator) {

				throw {
					name: 'Validator error',
					message: 'No handler for type ' + type
				};
			}

			if (!validator.validate(value)) {
				return validator.error;
			}
		}
	};


});
