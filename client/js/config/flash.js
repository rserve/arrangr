define(function (require, exports, module) {

	'use strict';

	var app = require('app');

	app.config(['flashProvider', function (flashProvider) {
		flashProvider.errorClassnames.push('alert-danger');
	}]);

});