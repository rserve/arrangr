define(function (require, exports, module) {

	'use strict';

	var _ = require('underscore');

	var User = require('./User');

	var LogEntry = function (data) {
		_.extend(this, data);
		this.user = new User(data.user);
	};



	module.exports = LogEntry;
});