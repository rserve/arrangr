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
		var select = field.create(config);

		//extend with overrides
		_.extend(select, {

		});

		return select;

	};


});