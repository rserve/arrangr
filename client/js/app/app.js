define(['angular', 'app/config'], function (angular, config) {

	'use strict';

	var app = angular.module(config.appName, []).

		//add config values
		value('version', config.version).
		value('name', config.appName);

	//export
	return  app;
});
