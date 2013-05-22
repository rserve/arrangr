'use strict';

define(['./formatDate'], function (formatDate) {

	//simple logger, append timestamp
	var logger = {
		log: function () {
			var slice = Array.prototype.slice,
				args = slice.call(arguments),
				stamp = formatDate(new Date(), '%H:%m:%s');

			args.unshift(stamp);
			Function.apply.call(console.log, console, args);
		}
	};
	return logger;
});