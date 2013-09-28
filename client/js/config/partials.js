define(function (require, exports, module) {

	'use strict';

	var base = '/partials/';

	var partials = {
        layout: 'layout.html',
		group: 'group.html',
		groups: 'groups.html',
		logout: 'logout.html',
        verify: 'verify.html',
		notFound: 'not-found.html',
		home: 'home.html',
		demoForm: 'demo-form.html',
        header: 'header.html'
	};

	for (var key in partials) {
		partials[key] = base + partials[key];
	}

	module.exports = partials;
});