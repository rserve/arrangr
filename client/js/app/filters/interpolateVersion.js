define([], function () {

	'use strict';

	var factory = ['version', function (version) {
		return function (text) {
			return String(text).replace(/\%VERSION\%/mg, version);
		};
	}];

	//export
	return  factory;
});
