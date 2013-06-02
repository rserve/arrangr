/* Services */

define(['app/app', './groups', './localization'], function (app, groups, localization) {

	'use strict';

	app.factory('groupsService', groups).
		factory('localization', localization);

	//no export
});
