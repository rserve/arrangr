define([], function () {

	'use strict';

	return ['version', function factory(version) {
		return function (scope, elm, attrs) {
			elm.text(version);
		};
	}];


});
