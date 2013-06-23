define(function (require, exports, module) {

	'use strict';

	var base = '/partials/';

	var partials = {
		group: 'group.html',
		groups: 'groups.html',
		login: 'login.html',
		logout: 'logout.html',
		register: 'register.html',
		userInfo: 'user-info.html',
		empty: 'empty.html',
		notFound: 'not-found.html',
		old: 'old.html',
		demoForm: 'demo-form.html'
	};

	for (var key in partials) {
		partials[key] = base + partials[key];
	}

	module.exports = partials;
});