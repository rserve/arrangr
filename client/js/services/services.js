define(function (require, exports, module) {

	'use strict';

	var app = require('app'),
		groupsClient = require('./api/groupsClient'),
		usersClient = require('./api/usersClient'),
		localization = require('./localization'),
		authState = require('./authState');


	app.factory('groupsClient', groupsClient).
		factory('usersClient', usersClient).
		factory('localization', localization).
		factory('authState', authState);

	//no export
});
