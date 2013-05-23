define([], function () {

	'use strict';

	var formatDate = function (date, fmt) {
		function pad(value) {
			return (value.toString().length < 2) ? '0' + value : value;
		}

		return fmt.replace(/%([a-zA-Z])/g, function (_, fmtCode) {
			switch (fmtCode) {
			case 'Y':
				return date.getUTCFullYear();
			case 'M':
				return pad(date.getUTCMonth() + 1);
			case 'd':
				return pad(date.getUTCDate());
			case 'H':
				return pad(date.getUTCHours());
			case 'm':
				return pad(date.getUTCMinutes());
			case 's':
				return pad(date.getUTCSeconds());
			case 'S':
				return pad(date.getUTCMilliseconds());
			default:
				throw new Error('Unsupported format code: ' + fmtCode);
			}
		});
	};

	return {
		formatDate: formatDate
	};

});