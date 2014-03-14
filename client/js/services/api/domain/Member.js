define(function (require, exports, module) {

	'use strict';

	var _ = require('underscore');
	var moment = require('moment');

	var Member = function (data) {
		_.extend(this, data);
	};

	var proto = Member.prototype;

	proto.statusOrderValue = function() {
		switch(this.status) {
			case 'Yes':
				return 0;
			case 'Maybe':
				return 1;
			case 'No':
				return 2;
			default:
				return 3;
		}
	};

	module.exports = Member;
});
