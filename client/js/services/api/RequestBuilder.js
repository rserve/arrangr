define(function (require, exports, module) {

	var _ = require('underscore');

	'use strict';

	var RequestBuilder = function () {
		this.path = [];
	};

	var proto = RequestBuilder.prototype;


	proto.setMethod = function (method) {
		this.method = method;
		return this;
	};


	proto.setUrl = function (url) {
		this.url = url;
		return this;
	};

	proto.addPath = function (path) {

		this.path.push(path);

		return this;
	};

	proto.setData = function (data) {
		this.data = data;
		return this;
	};

	proto.setSuccessCb = function (cb) {
		this.success = cb;
		return this;
	};

	proto.setErrorCb = function (cb) {
		this.error = cb;
		return this;
	};

	proto.addResponseMiddleware = function (fn) {
		this.respMiddleware = fn;
		return this;
	};

	proto.build = function () {

		var _this,
			fullUrl = this.url;

		//add paths to full url
		if (this.path.length > 0) {
			fullUrl += '/' + this.path.join('/');
		}

		var successCb;


		if (this.respMiddleware) {
			successCb = _.bind(function (data) {
				this.success(this.respMiddleware(data));
			}, this);

		} else {
			successCb = this.success;
		}

		return {
			url: fullUrl,
			method: this.method,
			data: this.data,
			success: successCb,
			error: this.error

		}
	};

	module.exports = RequestBuilder;

});
