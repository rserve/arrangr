define([], function () {

	'use strict';

	var factory = ['version', function (version) {
		return function (scope, elm, attrs) {
			elm.text(version);
		};
	}];


	//export
	return  factory;
});
