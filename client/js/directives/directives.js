define(function (require, exports, module) {

	'use strict';
	var app = require('app'),
        imagedrop = require('./imagedrop'),
        confirm = require('./confirm');

    app.directive('imagedrop', ['flash', imagedrop]);
    app.directive('ngConfirmClick', confirm);

});
