/*global define*/

define(function (require, exports, module) {

	'use strict';

	var _ = require('underscore'),
		validatorManager = Object.create(require('../validatorManager')),
		validators = require('../validators');

	var defaults = {
		validator: 'notEmpty',
		status: null,
		message: null,
		value: null,
		name: null,
		placeholder: null,
		mandatory: true
	};


	validatorManager.addValidators(validators);

	var baseField = {

		reset: function () {
			_.extend(this, {
				value: null,
				message: null,
				status: null
			});
		},

		setMessage: function (status, message) {
			this.status = status || '';
			this.message = message || '';
		},

		getValue: function () {
			return this.value;
		},


		//todo this smell, clean up responsibilities
		validate: function () {
			if (this.mandatory) {
				var error, customValidator = this.customValidator;
				if (customValidator) {
					if (!customValidator.validate(this.value)) {
						error = customValidator.error;
					}
				} else {
					error = validatorManager.validateField(this.validator, this.value);
				}

				if (error) {
					this.setMessage( 'error',error.message);
				}
				return  error;
			}
		},

		/*
		* return field attribute that should be "watched" in angular scope
		* */
		getBoundAttribute: function () {
			return 'value';
		},

		/*
		* Has user entered anything in field?
		* */
		isEmpty: function () {
			return this.value === null || this.value.length===0;
		}

	};

	/*
	* Export create method
	* */
	exports.create = function (config) {

		var field = Object.create(baseField);

		_.extend(field, defaults, config);

		//check for custom validator
		if (_.isObject(config.validator)) {
			field.customValidator = config.validator;
			field.validator = config.validator.type;
		}

		return field;

	}

});