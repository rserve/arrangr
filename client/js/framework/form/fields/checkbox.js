/*
 * checkbox.js
 *
 * A class representing a form checkbox, extends field.
 *
 * */

define(function (require, exports, module) {

	'use strict';


	var _ = require('underscore'),
		field = require('./field');


	/*
	 * Export create method to enforce instantiation
	 * */

	exports.create = function (config) {

		// create new field
		var checkbox = field.create(config);

		//extend with specifics for checkbox
		_.extend(checkbox, {

			//TODO check if this behavior still is valid
			validate: function () {
				if (!this.checked) {
					this.status = 'error';
					return {message: 'Input not checked'};
				} else {
					this.status = null;
				}

			},

			/*
			 * either checked or not checked
			 * */
			getValue: function () {
				return this.checked;
			},

			/*
			 * we are interested to changes for 'checked' attribute
			 * */
			getBoundAttribute: function () {
				return 'checked';
			},

			/*
			* Treat checkbox as not empty so we always get value from form.toJSON
			* */
			isEmpty: function () {
				return false;
			}
		});

		return checkbox;

	};


});