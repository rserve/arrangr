define(function (require, exports, module) {

	'use strict';

	var phrases = require('json!data/phrases_en.json');

	var factory = ['localization', function (localization) {
		return function (text, args) {

			var matches = text.match(/\%([A-Z_]*)\%/mg),
				key;

			matches.forEach(function (match) {
				key = match.trim().slice(1, -1);
				text = text.replace(match, localization.getPhrase(key, args));
			});

			return text;
		};
	}];

	//export
	module.exports = factory;
});
