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
		type: 'text',	//field value TODO this not working, dynamic types not allowed
		value: null,		//field type
		name: '',
		placeholder: 'I am default',
		mandatory: true
	};


	validatorManager.addValidators(validators);

	var field = {

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

		configure: function (config) {
			var _this = this;

			_.extend(this, defaults, config);

			//check for custom validator
			if (_.isObject(config.validator)) {
				_this.customValidator = config.validator;
				_this.validator = config.validator.type;
			}
			return this;

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

		isEmpty: function () {
			return this.value === null || this.value.length===0;
		}

	};

	module.exports = field;

});