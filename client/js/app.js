define(function (require, exports, module) {

	'use strict';

	var angular = require('angular'),
		config = require('json!data/config.json');


	//create app as module
	var app = angular.module(config.appName, ['ui.router', 'angular-flash.service', 'angular-flash.flash-alert-directive']).

		//add config values
		value('version', config.version).
		value('name', config.appName).
        config(function(flashProvider) {
            flashProvider.errorClassnames.push('alert-danger');
        });

	console.log('Angular module created:', config.appName, config.version);

	module.exports = app;
});
