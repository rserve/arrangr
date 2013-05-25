define(['app/app', './interpolateVersion'], function (app, interpolateVersion) {

	'use strict';

	//add all filters
	app.filter('interpolateVersion', interpolateVersion);

	//no export
});
