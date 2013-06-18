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
				validator;

			this.errors = [];

			for (param in data) {
				if (data.hasOwnProperty(param)) {
					value = data[param];

					//can override config in validate
					type = config ? config[param] : this.config[param];

					validator = this.validators[type];

					if (!validator) {

						throw {
							name: 'Validator error',
							message: 'No handler for type ' + type
						};
					}

					if (!validator.validate(value)) {
						this.errors.push(validator.error);
					}
				}
			}

			if (this.errors.length > 0) {
				return this.errors;
			}
		}
	};


});
