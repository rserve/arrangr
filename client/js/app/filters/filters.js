define(['app/app', './config', './phrase'], function (app, config, phrase) {

	'use strict';

	//add all filters
	app.filter('config', config).
		filter('phrase', phrase);

	//no export
});
