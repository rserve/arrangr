
define(['util'], function (util) {

	'use strict';

	/*
	 * simple logger, append timestamp and add some formatting
	 * */
	var logger = {
		log: function () {
			var slice = Array.prototype.slice,
				args = slice.call(arguments),
				stamp = util.date.formatDate(new Date(), '%H:%m:%s.%S');


			args.unshift(stamp); //add timestamp first

			//add pipes for visibility
			args = args.map(function (item) {
				return [item, '|'];
			});

			//flatten
			args = [].concat.apply([], args);

			//remove last pipe char
			args = args.slice(0, args.length - 1);

			//console log with new args
			Function.apply.call(console.log, console, args);
		}
	};

	//export
	return logger;
});