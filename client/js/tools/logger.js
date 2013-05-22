'use strict';

define(['./formatDate'], function (formatDate) {

	//simple logger, append timestamp
	var logger = {
		log: function () {
			var slice = Array.prototype.slice,
				args = slice.call(arguments),
				stamp = formatDate(new Date(), '%H:%m:%s');

			args.unshift(stamp); //add timestamp first

			//add pipes for visibility
			args = args.map(function (item) {
				return [item, '|'];
			});

			//flatten
			args = [].concat.apply([], args);

			//remove last pipe char
			args = args.slice(0,args.length-1);

			//console log with new args
			Function.apply.call(console.log, console, args);
		}
	};
	return logger;
});