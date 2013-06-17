define(function (require, exports, module) {

	'use strict';

    var config = require('json!data/config.json');

	var factory =  function () {
		return function (key) {
			return config[key];
		};
	};

    module.exports = factory;
});
