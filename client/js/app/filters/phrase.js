define(['json!data/phrases_en.json'], function (phrases) {

	'use strict';

	var factory = ['localization', function (localization) {
		return function (text) {


			var matches = text.match(/\%([a-zA-Z_]*)\%/mg),
				key;

			matches.forEach(function (match) {
				key = match.trim().slice(1, -1);
				text = text.replace(match, localization.getPhrase(key));
			});

			return text;
		};
	}];

	//export
	return  factory;
});
