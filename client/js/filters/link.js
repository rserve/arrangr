define(function (require, exports, module) {

	'use strict';

    var regex = /\%(.*)\:(.*)\%/mg;

	var factory = function () {
		return function (text, args) {
            if(text) {
                var match;
                while(match = regex.exec(text) ) {
                    text = text.replace(match[0], '<a href="'+match[2]+'">'+match[1]+'</a>');
                }
            }

			return text;
		};
	};

	module.exports = factory;
});
