define(function (require, exports, module) {

	'use strict';

	var app = require('app');

	app.run(['$rootScope', 'authState', function ($rootScope, authState) {

		authState.refreshUserState();

		$rootScope.appInitialized = true;
	}]);

	module.exports = app;
});
