define(['json!data/phrases_en.json'], function (phrases) {

	'use strict';

	var factory = ['$window', function ($window) {

		var localization = {
			//language: $window.navigator.userLanguage || $window.navigator.language,
			language: 'en', //just english for now

			getPhrase: function (key) {
				return phrases[key] || key
			}
		};

		return localization;
	}];

	//export
	return factory;

});
