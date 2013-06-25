/*global define*/

define(function (require, exports, module) {

	'use strict';

	var _ = require('underscore'),
		checkbox = require('./checkbox'),
		composite = require('./composite'),
		input = require('./input'),
		select = require('./select');


	var factory = {

		createInput: function (config) {
			return Object.create(input).configure(config);
		},
		createCheckbox: function (config) {
			return Object.create(checkbox).configure(config);
		},
		createSelect: function (config) {
			return Object.create(select).configure(config);
		}

	};

	module.exports = factory;

});