define(function (require, exports, module) {

    // Convert status code to bootstrap3 alert classes

	'use strict';

    var replace = {
        'error': 'danger'
    };

	var factory = function () {
		return function (text, args) {
            if(text) {
                for(var word in replace) {
                    text = text.replace(word, replace[word]);
                }
            }

			return text;
		};
	};

	//export
	module.exports = factory;
});
