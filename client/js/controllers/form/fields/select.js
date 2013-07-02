/*global define*/

define(function (require, exports, module) {

	'use strict';

	var field = require('./field');

	exports.create = function (config) {
		return field.create(config);
	}

});