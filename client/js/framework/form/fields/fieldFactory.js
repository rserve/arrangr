/*
 * fieldFactory.js
 *
 * Simple factory object to help creating fields
 *
 * */

define(function (require, exports, module) {

	'use strict';

	var _ = require('underscore'),
		field = require('./field'),
		checkbox = require('./checkbox'),
		select = require('./select');


	var factory = {

		create: function (config) {
			switch (config.type) {
			case 'checkbox':
				return checkbox.create(config);
			case 'select':
				return select.create(config);
			default:
				return field.create(config);
			}
		}

	};


	module.exports = factory;

});