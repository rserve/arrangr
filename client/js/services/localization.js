define(function (require, exports, module) {

	'use strict';

	var phrases = require('json!data/phrases_en.json');

	var factory = ['$window', function ($window) {

		var localization = {
			//language: $window.navigator.userLanguage || $window.navigator.language,
			language: 'en', //just english for now

			getPhrase: function (key, args) {

				var phrase = phrases[key],
					i,
					len;

				if (phrase && args) {
					for (i = 0, len = args.length; i < len; i++) {
						phrase = phrase.replace('{' + i + '}', args[i]);
					}
				}
				return phrase || key;
			}
		};

		return localization;
	}];


	module.exports = factory;

});
