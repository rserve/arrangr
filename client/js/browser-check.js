(function (global) {

	'use strict';

	/*!
	 * Detect is taken (and modified) from:
	 *
	 * Bowser - a browser detector
	 * https://github.com/ded/bowser
	 * MIT License | (c) Dustin Diaz 2013
	 */

	var detect = (function () {

		/**
		 * navigator.userAgent =>
		 * Chrome:  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_7) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.57 Safari/534.24"
		 * Opera:   "Opera/9.80 (Macintosh; Intel Mac OS X 10.6.7; U; en) Presto/2.7.62 Version/11.01"
		 * Safari:  "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_7; en-us) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1"
		 * IE:      "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/5.0; SLCC2;
		 *            .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C)"
		 * IE>=11:  "Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; .NET4.0E; .NET4.0C; Media Center PC 6.0; rv:11.0) like Gecko"
		 * Firefox: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv:2.0) Gecko/20100101 Firefox/4.0"
		 * iPhone:  "Mozilla/5.0 (iPhone Simulator; U; CPU iPhone OS 4_3_2 like Mac OS X; en-us) AppleWebKit/533.17.9
		 *            (KHTML, like Gecko) Version/5.0.2 Mobile/8H7 Safari/6533.18.5"
		 * iPad:    "Mozilla/5.0 (iPad; U; CPU OS 4_3_2 like Mac OS X; en-us) AppleWebKit/533.17.9
		 *            (KHTML, like Gecko) Version/5.0.2 Mobile/8H7 Safari/6533.18.5",
		 * Android: "Mozilla/5.0 (Linux; U; Android 2.3.4; en-us; T-Mobile G2 Build/GRJ22) AppleWebKit/533.1
		 *            (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1"
		 * Touchpad: "Mozilla/5.0 (hp-tabled;Linux;hpwOS/3.0.5; U; en-US)) AppleWebKit/534.6 (KHTML, like Gecko)
		 *                wOSBrowser/234.83 Safari/534.6 TouchPad/1.0"
		 * PhantomJS: "Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/534.34 (KHTML, like Gecko)
		 *                PhantomJS/1.5.0 Safari/534.34"
		 * Amazon Silk: "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_3; en-us; Silk/1.0.22.153_10033210)
		 *                AppleWebKit/533.16 (KHTML, like Gecko) Version/5.0 Safari/533.16 Silk-Accelerated=true"
		 */

		var ua = navigator.userAgent,
			t = true,
			ie = /(msie|trident)/i.test(ua),
			chrome = /chrome|crios/i.test(ua),
			phantom = /phantom/i.test(ua),
			iphone = /iphone/i.test(ua),
			ipad = /ipad/i.test(ua),
			touchpad = /touchpad/i.test(ua),
			silk = /silk/i.test(ua),
			safari = /safari/i.test(ua) && !chrome && !phantom && !silk,
			android = /android/i.test(ua),
			opera = /opera/i.test(ua) || /opr/i.test(ua),
			firefox = /firefox/i.test(ua),
			gecko = /gecko\//i.test(ua),
			seamonkey = /seamonkey\//i.test(ua),
			webkitVersion = /version\/(\d+(\.\d+)?)/i,
			firefoxVersion = /firefox\/(\d+(\.\d+)?)/i,
			o;

		function detect() {
			if (ie) {
				return {
					name: 'Internet Explorer', msie: t, version: ua.match(/(msie |rv:)(\d+(\.\d+)?)/i)[2]
				};
			}
			if (opera) {
				return {
					name: 'Opera', opera: t, version: ua.match(webkitVersion) ? ua.match(webkitVersion)[1] : ua.match(/opr\/(\d+(\.\d+)?)/i)[1]
				};
			}
			if (chrome) {
				return {
					name: 'Chrome', webkit: t, chrome: t, version: ua.match(/(?:chrome|crios)\/(\d+(\.\d+)?)/i)[1]
				};
			}
			if (phantom) {
				return {
					name: 'PhantomJS', webkit: t, phantom: t, version: ua.match(/phantomjs\/(\d+(\.\d+)+)/i)[1]
				};
			}
			if (touchpad) {
				return {
					name: 'TouchPad', webkit: t, touchpad: t, version: ua.match(/touchpad\/(\d+(\.\d+)?)/i)[1]
				};
			}
			if (silk) {
				return {
					name: 'Amazon Silk', webkit: t, android: t, mobile: t, version: ua.match(/silk\/(\d+(\.\d+)?)/i)[1]
				};
			}
			if (iphone || ipad) {
				o = {
					name: iphone ? 'iPhone' : 'iPad', webkit: t, mobile: t, ios: t, iphone: iphone, ipad: ipad
				};
				// WTF: version is not part of user agent in web apps
				if (webkitVersion.test(ua)) {
					o.version = ua.match(webkitVersion)[1];
				}
				return o;
			}
			if (android) {
				return {
					name: 'Android', webkit: t, android: t, mobile: t, version: (ua.match(webkitVersion) || ua.match(firefoxVersion))[1]
				};
			}
			if (safari) {
				return {
					name: 'Safari', webkit: t, safari: t, version: ua.match(webkitVersion)[1]
				};
			}
			if (gecko) {
				o = {
					name: 'Gecko', gecko: t, mozilla: t, version: ua.match(firefoxVersion)[1]
				};
				if (firefox) {
					o.name = 'Firefox';
					o.firefox = t;
				}
				return o;
			}
			if (seamonkey) {
				return {
					name: 'SeaMonkey', seamonkey: t, version: ua.match(/seamonkey\/(\d+(\.\d+)?)/i)[1]
				};
			}
			return {};
		}

		return detect;
	})();

	var dom = {
		bindEvent: function (el, eventName, eventHandler) {
			if (el.addEventListener) {
				el.addEventListener(eventName, eventHandler, false);
			} else if (el.attachEvent) {
				el.attachEvent('on' + eventName, eventHandler);
			}
		},
		eventTarget: function (e) {
			return e && (e.target ? e.target : e.srcElement);
		},
		getElement: function (id) {
			return document.getElementById(id);
		},
		hideElement: function (id) {
			var el = this.getElement(id);
			if (el) {
				el.style.display = 'none';
			}
		},
		showElement: function (id) {
			var el = this.getElement(id);
			if (el) {
				el.style.display = 'block';
			}
		}

	};


	function isBrowserOutOfDate() {
		var bowser = detect();

		// Do no accept any desktop browsers before 2011
		// http://www.impressivewebs.com/release-history-major-browsers/
		// note: mobile and unknown browsers are ignored
		return !!((bowser.msie && bowser.version < 9) ||
			(bowser.chrome && bowser.version < 12) ||
			(bowser.firefox && bowser.version < 4.0) ||
			(bowser.safari && bowser.version < 5.1) ||
			(bowser.opera && bowser.version < 11.5));

	}

	function bindEvents() {
		dom.bindEvent(dom.getElement('update-browser-modal'), 'click', hideUpdateModal);
	}

	function showUpdateModal() {
		dom.showElement('update-browser-modal');
		dom.showElement('backdrop');
	}

	function hideUpdateModal(e) {

		var target = dom.eventTarget(e);
		if (!target || target.id === 'update-browser-modal' || target.id === 'update-browser-close-button') {
			dom.hideElement('update-browser-modal');
			dom.hideElement('backdrop');
		}

	}


	global.checkBrowser = function () {

		if (isBrowserOutOfDate()) {
			bindEvents();
			showUpdateModal();
		}
	};

})(window);