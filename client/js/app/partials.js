define([], function () {

	'use strict';

	var base = '/partials/';
	var partials = {
		group: 'group.html',
		groups: 'groups.html',
		login: 'login.html',
		logout: 'logout.html',
		register: 'register.html'
	};

	for (var key in partials) {
		partials[key] = base + partials[key];
	}

	//export
	return partials;
});