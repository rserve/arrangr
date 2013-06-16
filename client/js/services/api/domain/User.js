/*
 * Register controllers
 * */

define(function (require, exports, module) {

	'use strict';

	var _ = require('underscore');

	var User = function (data) {
		_.extend(this, data);
	};

	module.exports = User;
});