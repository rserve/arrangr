/*global define*/

define(function (require, exports, module) {

	'use strict';

	var _ = require('underscore'),
		baseField = require('./baseField');

	var input = Object.create(baseField);

	//TODO input seems to be default usage, don't see any need for this class, could be "baseField"

	module.exports = input;

});