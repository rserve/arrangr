/*global define*/

define(function (require, exports, module) {

	'use strict';

	var _ = require('underscore'),
		field = require('./field');


	/*
	 * Export create method
	 * */
	exports.create = function (config) {

		// create new field
		var checkbox = field.create(config);

		//extend with overrides
		_.extend(checkbox, {

			validate: function () {
				if (!this.checked) {
					this.status = 'error';
					return {message: 'Input not checked'};
				} else {
					this.status = null;
				}

			},

			getValue: function () {
				return this.checked;
			},

			getBoundAttribute: function () {
				return 'checked';
			},

			//always treat checkbox as not empty
			isEmpty: function () {
				return false;
			}
		});

		return checkbox;

	};


});