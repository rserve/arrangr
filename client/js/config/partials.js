define(function (require, exports, module) {

	'use strict';

	var base = '/partials/';

	var partials = {
        layout: 'layout.html',
		group: 'group.html',
		groups: 'groups.html',
		login: 'login.html',
		logout: 'logout.html',
		register: 'register.html',
        verify: 'verify.html',
		userInfo: 'user-info.html',
		empty: 'empty.html',
		notFound: 'not-found.html',
		home: 'home.html',
		demoForm: 'demo-form.html',
        heading: 'heading.html'
	};

	for (var key in partials) {
		partials[key] = base + partials[key];
	}

	module.exports = partials;
});