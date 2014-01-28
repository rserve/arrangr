define(function (require, exports, module) {

	'use strict';

	var base = '/partials/';

	var partials = {
        home: 'home.html',
        layout: 'layout.html',
        group: 'group.html',
		groupEdit: 'group-edit.html',
		groups: 'groups.html',
		header: 'header.html',
		profile: 'profile.html',
		password: 'password.html'
	};

	for (var key in partials) {
		partials[key] = base + partials[key];
	}

	module.exports = partials;
});