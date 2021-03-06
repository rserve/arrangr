define(function (require, exports, module) {

	'use strict';

	var BaseClient = function ($http) {
		this.$http = $http;
	};

	var proto = BaseClient.prototype;

	proto.sendRequest = function (req) {
		var httpArgs = [];

		//add args for $http
		httpArgs.push(req.url);
		if (req.data) {
			httpArgs.push(req.data);
		}

		//proxy through http
		this.$http[req.method].apply(this.$http, httpArgs).
			success(function (data) {
				httpSuccess(req, data);
			}).
			error(function (data, status) {
				httpError(req, data, status);
			});

	};

	function httpSuccess(req, data) {
		//if server return error
		if (data.error && req.error) {
			req.error(data);
		} else if (req.success) {
			req.success(data);
		}
	}

	function httpError(req, data, status) {
		if (req.error) {
            data.status = status;
			req.error(data);
		}
	}

	module.exports = BaseClient;

});
