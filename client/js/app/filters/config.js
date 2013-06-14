//define(['json!config.json'], function (config) {
/*require('tools/myScript', function(myScript){

});*/

define(function (require, exports, module) {

	'use strict';

    var config = require('json!config.json');

	var factory =  function () {
		return function (key) {
			return config[key];
		};
	};

	//export
	//return  factory;
    module.exports = factory;
});
