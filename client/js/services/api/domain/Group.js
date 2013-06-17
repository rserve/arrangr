define(function (require, exports, module) {

	'use strict';

	var _ = require('underscore');

	var Group = function (data) {
		_.extend(this, data);
	};

	var proto = Group.prototype;

	proto.isAdmin = function (user) {

		for (var i = 0, len = this.members.length; i < len; i++) {
			var member = this.members[i];
			if (member.user === user._id && member.admin) {
				return true;
			}
		}
		return false;
	};

	module.exports = Group;
});