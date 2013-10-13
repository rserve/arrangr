define(function (require, exports, module) {

	'use strict';

	var angular = require('angular'),
		config = require('json!data/config.json');


	//create app as module
	var app = angular.module(config.appName, ['ui.router', 'angular-flash.service', 'angular-flash.flash-alert-directive','angularMoment']).

		value('version', config.version).
		value('name', config.appName);

	console.log('Angular module created:', config.appName, config.version);

	module.exports = app;
});
