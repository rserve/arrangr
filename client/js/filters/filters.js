define(function (require, exports, module) {

	'use strict';

	var app = require('app'),
		config = require('./config'),
		phrase = require('./phrase'),
        link = require('./link'),
        alert = require('./alert');

	app.filter('config', config)
       .filter('phrase', phrase)
       .filter('link', link)
       .filter('alert', alert);

});
