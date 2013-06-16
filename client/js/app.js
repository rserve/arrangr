define(['angular', 'json!config.json'], function (angular, config) {

	'use strict';

	var app = angular.module(config.appName, ['ngCookies']).

		//add config values
		value('version', config.version).
		value('name', config.appName);

	//export
	return  app;
});
