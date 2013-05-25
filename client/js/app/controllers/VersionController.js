define(['framework/logger', 'app/partials'], function (logger, partials) {

	'use strict';

	var Controller = function ($scope, $http) {

		$scope.text = '__________________________________________';
		$scope.template = {name: 'version', url: partials.version};

	};

	//export
	return Controller;

});
