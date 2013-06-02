define(['json!config.json'], function (config) {

	'use strict';

	var factory =  function () {
		return function (key) {
			return config[key];
		};
	};

	//export
	return  factory;
});
