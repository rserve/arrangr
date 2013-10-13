define(function (require, exports, module) {

	'use strict';

	var _ = require('underscore');

	var Comment = function (data) {
		_.extend(this, data);
	};

	var proto = Comment.prototype;

/*	proto.displayTime = function () {
		if (this.createdAt) {
			var d = new Date(this.createdAt);
			return (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
		}
		return null;
	};*/



	module.exports = Comment;
});