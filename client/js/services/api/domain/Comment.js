define(function (require, exports, module) {

	'use strict';

	var _ = require('underscore');

	var Comment = function (data) {
		_.extend(this, data);
	};

	var proto = Comment.prototype;


	proto.isOwner = function (user) {
		return this.userRefId === user.id;
	};

	module.exports = Comment;
});