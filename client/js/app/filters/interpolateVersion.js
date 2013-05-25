define([], function () {

	'use strict';

	return ['version', function (version) {
		return function (text) {
			return String(text).replace(/\%VERSION\%/mg, version);
		};
	}];
});
