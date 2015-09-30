define(function (require, exports, module) {

	'use strict';

	var _ = require('underscore');

	var User = require('./User');

	var Comment = function (data) {
		_.extend(this, data);
		this.user = new User(data.user);
	};

	var proto = Comment.prototype;


	proto.isOwner = function (user) {
		return user && this.user.id === user.id;
	};

	module.exports = Comment;
});