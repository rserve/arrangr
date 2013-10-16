define(function (require, exports, module) {

	'use strict';

	var RequestBuilder = require('./RequestBuilder'),
		BaseClient = require('./BaseClient'),
		Group = require('./domain/Group'),
		User = require('./domain/User'),
		Comment = require('./domain/Comment');

	var service = ['$http', function ($http) {

		/*
		 * Response parsers
		 * */
		var groupsParser = function (data) {

			return data.map(function (attr) {
				return new Group(attr);
			});

		};

		var groupParser = function (data) {
            var group = new Group(data);
            memberParser(group);
            commentParser(group);
			return group;
		};

		var memberParser = function(group) {
			group.members.forEach(function (member, i, members){
				members[i].user = new User(member.user);
			});
		};

		var commentParser = function(group) {
			group.comments.forEach(function (comment, i, comments){
				comments[i] = new Comment(comment);
			});
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
				setResponseParser(groupsParser).
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
				setResponseParser(groupParser).
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
				setResponseParser(groupParser).
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
                setResponseParser(groupParser).
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
                setResponseParser(groupParser).
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
                setResponseParser(groupParser).
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
                setResponseParser(groupParser).
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
                setResponseParser(groupParser).
                build();

            this.sendRequest(req);
        };

		client.addComment = function(key, data, success, error) {
			var req = new RequestBuilder().
				setMethod('post').
				setUrl('/api/groups').
				addPath(key).
				addPath('comments').
				setData(data).
				setSuccessCb(success).
				setErrorCb(error).
				setResponseParser(groupParser).
				build();

			this.sendRequest(req);
		};

		client.deleteComment = function(key, id, success, error) {
			var req = new RequestBuilder().
				setMethod('delete').
				setUrl('/api/groups').
				addPath(key).
				addPath('comments').
				addPath(id).
				setSuccessCb(success).
				setErrorCb(error).
				setResponseParser(groupParser).
				build();

			this.sendRequest(req);
		};

		return client;
	}];

	module.exports = service;

});

