/* Services */

define(['app/app', 'app/config'], function (app, config) {

	'use strict';

	app.value('version', config.version);
	app.value('name', config.appName);

});
