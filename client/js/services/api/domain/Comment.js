define(function (require, exports, module) {

	'use strict';

	var _ = require('underscore');

	var User = require('./user');

	var Comment = function (data) {
		_.extend(this, data);
		this.user = new User(data.user);
	};

	var proto = Comment.prototype;


	proto.isOwner = function (user) {
		return this.user.id === user.id;
	};

	module.exports = Comment;
});