define(function (require, exports, module) {

	'use strict';

	var RequestBuilder = require('./RequestBuilder'),
		BaseClient = require('./BaseClient'),
		User = require('./domain/User');

	var service = ['$http', function ($http) {

		var userParser = function (data){
			return new User(data);
		};

		var client = new BaseClient($http);

		var baseUrl = '/api/users';

		client.login = function (user, success, error) {

			var req = new RequestBuilder().
				setMethod('post').
				setUrl(baseUrl).
				addPath('login').
				setData(user).
				setSuccessCb(success).
				setErrorCb(error).
				addResponseMiddleware(userParser).
				build();

			this.sendRequest(req);

		};

		client.create = function (user, success, error) {

			var req = new RequestBuilder().
				setMethod('post').
				setUrl(baseUrl).
				setData(user).
				setSuccessCb(success).
				setErrorCb(error).
				addResponseMiddleware(userParser).
				build();

			this.sendRequest(req);

		};

        client.update = function (user, success, error) {

            var req = new RequestBuilder().
                setMethod('put').
                setUrl(baseUrl).
                setData(user).
                setSuccessCb(success).
                setErrorCb(error).
                addResponseMiddleware(userParser).
                build();

            this.sendRequest(req);

        };


        client.logout = function (success, error) {

			var req = new RequestBuilder().
				setMethod('get').
				setUrl(baseUrl).
				addPath('logout').
				setSuccessCb(success).
				setErrorCb(error).
				build();

			this.sendRequest(req);

		};

        client.verify = function (hash, success, error) {

            var req = new RequestBuilder().
                setMethod('get').
                setUrl(baseUrl).
                addPath('verify').
                addPath(hash).
                setSuccessCb(success).
                setErrorCb(error).
                addResponseMiddleware(userParser).
                build();

            this.sendRequest(req);

        };

		return client;
	}];


	module.exports = service;

});
