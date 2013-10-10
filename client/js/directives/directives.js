define(function (require, exports, module) {

	'use strict';
	var app = require('app'),
        imagedrop = require('./imagedrop');

	//add all directives
    app.directive('imagedrop', imagedrop);

	//no export
});
