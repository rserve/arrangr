/*global define*/

define(function (require, exports, module) {

	'use strict';

	var _ = require('underscore'),
		validatorManager = Object.create(require('../validatorManager')),
		validators = require('../validators');

	var defaults = {
		name: null,
		type: 'input',
		validator: 'notEmpty',
		error: null,
		value: null,
		mandatory: true
	};

	validatorManager.addValidators(validators);

	var baseField = {

		clear: function () {
			_.extend(this, {
				value: null,
				error: null
			});
		},

		getValue: function () {
			return this.value;
		},


		validate: function () {
			var error;
			if (this.mandatory) {
				error = validatorManager.validateField(this.validator, this.value);
				if (error && this.customError) {
					error = {message: this.customError};
				}
			}
			this.error = error;
			return error;
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
			return this.value === null || this.value.length === 0;
		}

	};

	/*
	 * Export create method
	 * */
	exports.create = function (config) {

		var field = Object.create(baseField);

		// add defaults, then any attributes/methods coming from config
		_.extend(field, defaults, config);

		return field;

	};

});