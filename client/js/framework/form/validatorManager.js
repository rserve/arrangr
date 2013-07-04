/*
 * validatorManager.js
 *
 * Class for managing different validators.
 *
 * TODO it is too complex for current setup, KISS
 *
 * */

define(function (require, exports, module) {

	'use strict';

	var _ = require('underscore');

	module.exports = {

		//TODO instantating this class (as is done) will fail as the followin three attributes will be bound to prottype
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

		/*
		* Validate with different strategies based on data and config
		* If config is not provided the config bound to instance is used.
		* */
		validate: function (data, config) {

			var param,
				value,
				type,
				error,
				errors;

			for (param in data) {

				if (data.hasOwnProperty(param)) {
					errors = errors || {};

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
