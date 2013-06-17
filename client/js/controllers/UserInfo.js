define(function (require, exports, module) {

	'use strict';

	var partials = require('config/partials');

	var Controller = function ($scope) {

		$scope.template = {name: 'userInfo', url: partials.userInfo};

	};

	Controller.$inject = ['$scope'];

	//export
	module.exports = Controller;

});
