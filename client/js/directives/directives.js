define(function (require, exports, module) {

	'use strict';
	var app = require('app'),
        imagedrop = require('./imagedrop');

    app.directive('imagedrop', ['flash', imagedrop]);

});
