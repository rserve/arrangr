define(function (require, exports, module) {

	'use strict';

	var _ = require('underscore');
	var moment = require('moment');

	var Group = function (data) {
		_.extend(this, data);
		this._weekday = this.weekday();
		this._time = this.time();
	};

	var proto = Group.prototype;

	proto.isAdmin = function (user) {
		return user && this.members.some(function (member) {
			return member.admin && member.user && (member.user === user.id || member.user.id === user.id);
		});

	};

	proto.isMember = function (user) {
		return !!this.member(user);
	};

	proto.member = function (user) {
		if (user) {
			for (var i = 0, len = this.members.length; i < len; i++) {
				var member = this.members[i];
				if (member.user && (member.user === user.id || member.user.id === user.id)) {
					return member;
				}
			}
		}
		return null;
	};

	proto.isOwner = function (user) {
		return user && this.createdBy == user.id;
	};

	proto.statusCount = function (status) {

		return this.members.filter(function (member) {
			return member.status == status;
		}).length;

	};

	proto.isNew = function () {
		return moment().subtract('days', 3).isBefore(this.createdAt);
	};

	proto.weekday = function () {
		if (this.startDate) {
			return moment(this.startDate).format('d');
		}
		return null;
	};

	proto.time = function () {
		if (this.startDate) {
			return moment(this.startDate).format('HH:mm');
		}
		return null;
	};

	proto.thumbnailPath = function () {
		return '/api/groups/' + this.key + '/thumbnail';
	};

	proto.upcoming = function() {
		return moment(this.startDate).isAfter();
	};

	module.exports = Group;
});