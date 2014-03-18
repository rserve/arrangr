define(function (require, exports, module) {

	'use strict';

	var _ = require('underscore');

	var User = function (data) {
		_.extend(this, data);

	};

	var proto = User.prototype;

	proto.displayName = function () {
		if(this.name) {
			return this.name;
		}

		var s = this.email.substring(0, this.email.indexOf('@')).replace('.', ' ').split(' ');
		var t = '';

		for(var i = 0; i < s.length; i++) {
			t += s[i][0].toUpperCase() + s[i].substring(1) + ' ';
		}

		return t.trim();
	};

	proto.thumbnailPath = function () {
		return '/api/users/' + this.id + '/thumbnail';
	};

	proto.thumbnailSrc = function () {
		if (!this.gravatar && this.image && this.image.data) {
			return this.image.data;
		}
		else {
			return "http://www.gravatar.com/avatar/[hashedEmail]?s=25&d=mm".replace('[hashedEmail]', this.hashedEmail);
		}
	};

	module.exports = User;
})
;