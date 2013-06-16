define(function (require, exports, module) {

	'use strict';

	var app = require('app'),
		config = require('./config'),
		phrase = require('./phrase');

	//add all filters
	app.filter('config', config).
		filter('phrase', phrase);

	//no export
});
