/* Services */

define(['app/app', './api/groupsClient', './api/usersClient', './localization', './authState'], function (app, groupsClient, usersClient, localization, authState) {

	'use strict';

	app.factory('groupsClient', groupsClient).
		factory('usersClient', usersClient).
		factory('localization', localization).
		factory('authState', authState);

	//no export
});
