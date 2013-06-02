define([ 'app/app', './appVersion', './helloWorld'], function (app, appVersion, helloWorld) {

	'use strict';

	//add all directives
	app.directive('helloWorld', helloWorld);

	//no export
});
