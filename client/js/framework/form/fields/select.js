/*global define*/

define(function (require, exports, module) {

	'use strict';


	var _ = require('underscore'),
		field = require('./field');

	/*
	 * Export create method to force instantation
	 * */
	exports.create = function (config) {

		// create new field
		var select = field.create(config);

		//TODO don't know if there will need to be any specifics for select compared to valuefield
		//extend with overrides
		_.extend(select, {

		});

		return select;

	};


});