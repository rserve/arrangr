define(['app/partials', ], function (partials) {

	'use strict';

	var Controller = function ($scope) {

		$scope.template = {name: 'userInfo', url: partials.userInfo};

	};

	Controller.$inject = ['$scope'];
//export
	return Controller;

})
;
