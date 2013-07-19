define(function (require, exports, module) {

	'use strict';

	var partials = require('config/partials');

	var Controller = function ($scope, $location) {

		$scope.template = {name: 'heading', url: partials.heading};
        $scope.show = function() {
            return $location.path() != '/';
        };

	};

	Controller.$inject = ['$scope', '$location'];

	//export
	module.exports = Controller;

});
