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

                text = text.replace( /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+(?![^\s]*?")([\w.,@?^=%&amp;:\/~+#-'!]*[\w@?^=%&amp;\/~+#-])?/ig, function(url) {
                    var wrap = document.createElement('div');
                    var anch = document.createElement('a');
                    anch.href = url;
                    anch.target = "_blank";
                    anch.innerHTML = url.length > 50 ? url.substring(0, 50) + '&hellip;' : url;
                    wrap.appendChild(anch);
                    return wrap.innerHTML;
                });
            }

			return text;
		};
	};

	module.exports = factory;
});
