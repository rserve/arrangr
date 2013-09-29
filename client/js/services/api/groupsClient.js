define(function (require, exports, module) {

	'use strict';

	var RequestBuilder = require('./RequestBuilder'),
		BaseClient = require('./BaseClient'),
		Group = require('./domain/Group'),
		User = require('./domain/User');

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
            var group = new Group(data);
            memberParser(group);
			return group;
		};

        var memberParser = function(group) {
            for(var j = 0, len = group.members.length; j < len; j++) {
                group.members[j].user = new User(group.members[j].user);
            }
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

		client.update = function (key, data, success, error) {
			var req = new RequestBuilder().
				setMethod('put').
				setUrl('/api/groups').
				addPath(key).
                setData(data).
				setSuccessCb(success).
				setErrorCb(error).
                addResponseMiddleware(groupParser).
				build();

			this.sendRequest(req);
		};

		client.join = function (key, data, success, error) {
			var req = new RequestBuilder().
				setMethod('post').
				setUrl('/api/groups').
				addPath(key).
				addPath('join').
                setData(data).
				setSuccessCb(success).
				setErrorCb(error).
                addResponseMiddleware(groupParser).
				build();

			this.sendRequest(req);
		};

        client.updateMember = function(key, id, data, success, error) {
            var req = new RequestBuilder().
                setMethod('put').
                setUrl('/api/groups').
                addPath(key).
                addPath('members').
                addPath(id).
                setData(data).
                setSuccessCb(success).
                setErrorCb(error).
                addResponseMiddleware(groupParser).
                build();

            this.sendRequest(req);
        };

        client.invite = function(key, data, success, error) {
            var req = new RequestBuilder().
                setMethod('post').
                setUrl('/api/groups').
                addPath(key).
                addPath('invite').
                setData(data).
                setSuccessCb(success).
                setErrorCb(error).
                addResponseMiddleware(groupParser).
                build();

            this.sendRequest(req);
        };

        client.removeMember = function(key, id, success, error) {
            var req = new RequestBuilder().
                setMethod('delete').
                setUrl('/api/groups').
                addPath(key).
                addPath('members').
                addPath(id).
                setSuccessCb(success).
                setErrorCb(error).
                addResponseMiddleware(groupParser).
                build();

            this.sendRequest(req);
        };

		return client;
	}];

	module.exports = service;

});

