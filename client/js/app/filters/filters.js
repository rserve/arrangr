define(['app/app', './interpolateVersion'], function (app, interpolateVersion) {

	'use strict';

	return app.filter('interpolateVersion', interpolateVersion);
});
