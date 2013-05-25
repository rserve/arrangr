define([], function () {

	'use strict';

	var factory = function () {
		return function (scope, elm, attrs) {
			elm.text('Hello world from directive!');
		};
	};

	//export
	return factory;

});
