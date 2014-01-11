define(function (require, exports, module) {

	'use strict';

	var phrases = require('json!data/phrases_en.json');

	var factory = ['$window', function ($window) {

		// Display 24 hours time instead of moment default AM/PM
		$window.moment.lang('en', {
			calendar : {
				lastDay : '[Yesterday at] HH:mm',
				sameDay : '[Today at] HH:mm',
				nextDay : '[Tomorrow at] HH:mm',
				lastWeek : '[last] dddd [at] HH:mm',
				nextWeek : 'dddd [at] HH:mm',
				sameElse : 'D/M YYYY'
			}
		});

		var localization = {

			language: 'en',

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
