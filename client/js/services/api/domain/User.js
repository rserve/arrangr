define(function (require, exports, module) {

	'use strict';

	var _ = require('underscore');

	var User = function (data) {
		_.extend(this, data);

	};

	var proto = User.prototype;


	module.exports = User;
});