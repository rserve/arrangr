/*global define*/

define(function (require, exports, module) {

	'use strict';

	var _ = require('underscore'),
		baseField = require('./baseField');

	var checkbox = Object.create(baseField);

	/*
	 * @override
	 * */
	checkbox.validate = function () {
		if (!this.checked) {
			this.status = 'error';

			return {message: 'Input not checked'};
		} else {
			this.status = null;
		}

	};

	/*
	 * @override
	 * */
	checkbox.getValue = function () {
		return this.checked;
	};

	/*
	 * bind "watched" to checked attribute
	 *
	 * @override
	 * @parent baseField
	 * */
	checkbox.getBoundAttribute = function () {
		return 'checked';
	};

	checkbox.isEmpty = function () {
		return false;
	};


	module.exports = checkbox;

});