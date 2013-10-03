/*
 * field.js
 *
 * A class representing a a basic form field based on value attribute, for example input.
 *
 * */

define(function (require, exports, module) {

	'use strict';

	///////////////////////////////////////////////////
	//	DEPENDENCIES
	///////////////////////////////////////////////////

	var _ = require('underscore'),
		validatorManager = require('../validatorManager'),
		validators = require('../validators');

	///////////////////////////////////////////////////
	//	PRIVATES
	///////////////////////////////////////////////////

	var defaults = {
		name: null,
		type: 'input',
		validator: 'notEmpty',
		error: null,
		value: null,
        initialValue: null,
		mandatory: true
	};

	// TODO a bit ugly to have logic on top closure, i.e. order of requiring should never matter.
	var fieldValidator = validatorManager.create();
	fieldValidator.addValidators(validators);


	///////////////////////////////////////////////////
	//	METHODS
	///////////////////////////////////////////////////

	var baseField = {

		/*
		 * Clear value and any error on field
		 * */
		clear: function () {
			_.extend(this, {
				value: this.initialValue,
				error: null
			});
		},

		getValue: function () {
			return this.value;
		},

		validate: function () {
			var error;
			if (this.mandatory) {
				error = fieldValidator.validateField(this.validator, this.value);
				if (error && this.customError) {
					error = {message: this.customError};
				}
			}
			this.error = error; // if no error found this line will reset any previous error
			return error;
		},

		/*
		 * return field attribute that should be "watched" in angular scope
		 * */
		getBoundAttribute: function () {
			return 'value';
		},

		/*
		 * Differentiate between empty field and "falsy" value
		 * */
		isEmpty: function () {
			return this.value === null || this.value === undefined || this.value.length === 0;
		}

	};


	///////////////////////////////////////////////////
	//	EXPORT
	///////////////////////////////////////////////////

	/*
	 * Export create method to force instantiation
	 * */
	exports.create = function (config) {

		var field = Object.create(baseField);

		// add defaults, then any attributes/methods coming from config
		_.extend(field, defaults, config);

		return field;

	};

});