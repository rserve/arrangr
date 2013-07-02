define(function (require, exports, module) {

	'use strict';

	var RequestBuilder = require('./RequestBuilder'),
		BaseClient = require('./BaseClient'),
		Group = require('./domain/Group');

	var service = ['$http', function ($http) {

		/*
		 * Response parsers
		 * */
		var groupsParser = function (data) {
			var groups = [];

			for (var i = 0, len = data.length; i < len; i++) {
				var group = new Group(data[i]);
				groups.push(group);

			}
			return groups;
		};

		var groupParser = function (data) {
			return  new Group(data);
		};


		/*
		 * Groups client
		 * */
		var client = new BaseClient($http);

		client.findAll = function (success, error) {
			var req = new RequestBuilder().
				setMethod('get').
				setUrl('/api/groups').
				setSuccessCb(success).
				setErrorCb(error).
				addResponseMiddleware(groupsParser).
				build();

			this.sendRequest(req);

		};

		client.findByKey = function (key, success, error) {
			var req = new RequestBuilder().
				setMethod('get').
				setUrl('/api/groups').
				addPath(key).
				setSuccessCb(success).
				setErrorCb(error).
				addResponseMiddleware(groupParser).
				build();

			this.sendRequest(req);
		};

		client.create = function (data, success, error) {
			var req = new RequestBuilder().
				setMethod('post').
				setUrl('/api/groups').
				setData(data).
				setSuccessCb(success).
				setErrorCb(error).
				addResponseMiddleware(groupParser).
				build();

			this.sendRequest(req);
		};

		client.delete = function (key, success, error) {
			var req = new RequestBuilder().
				setMethod('delete').
				setUrl('/api/groups').
				addPath(key).
				setSuccessCb(success).
				setErrorCb(error).
				build();

			this.sendRequest(req);
		};

		client.update = function (key, success, error) {
			var req = new RequestBuilder().
				setMethod('put').
				setUrl('/api/groups').
				addPath(key).
				setSuccessCb(success).
				setErrorCb(error).
				build();

			this.sendRequest(req);
		};

		client.join = function (key, success, error) {
			var req = new RequestBuilder().
				setMethod('post').
				setUrl('/api/groups').
				addPath(key).
				addPath('join').
				setSuccessCb(success).
				setErrorCb(error).
				build();

			this.sendRequest(req);
		};

        client.updateMember = function(id, data, success, error) {
            var req = new RequestBuilder().
                setMethod('put').
                setUrl('/api/groups/members').
                addPath(id).
                setData(data).
                setSuccessCb(success).
                setErrorCb(error).
                build();

            this.sendRequest(req);
        };


		return client;
	}];

	module.exports = service;

});

