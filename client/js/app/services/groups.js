define([], function () {

	'use strict';

	var service = function ($http) {

		/*
		 * groups request implemented as builder
		 * */

		var request = {

			/*
			 * attributes
			 * */

			url: '/api/groups',

			/*
			 * builder methods
			 * */
			method: function (method) {
				this._method = method;
				return this;
			},

			path: function (path) {

				if (!this._path) {
					this._path = [];
				}

				this._path.push(path);

				return this;
			},

			data: function (data) {
				this._data = data;
				return this;
			},

			success: function (cb) {
				this._success = cb;
				return this;
			},

			error: function (cb) {
				this._error = cb;
				return this;
			},

			validate: function () {

			},

			/*
			 * Executes our call.
			 * If validate error run error callback, else proxy through angular http
			 * */
			execute: function () {
				var _this = this,
					path = this._path,
					url = this.url,
					method = this._method,
					data = this._data,
					args = [],
					errors;

				//add paths to url if available
				//TODO use regexp and store url as '/api/groups/:id' instead
				if (path) {
					url += '/' + path.join('/');
				}


				errors = this.validate();
				if (errors) {
					this._error(errors);
				} else {

					//add args for $http
					args.push(url);
					if (data) {
						args.push(data);
					}
					//proxy through http
					$http[method].apply($http, args).success(function (data) {

						//if server return error, throw error
						//TODO handle http errors
						if (data.error && _this._error) {
							_this._error(data);
						} else {
							_this._success(data);
						}

					});
				}
			}
		};


		/*
		 * Service methods (API)
		 * */
		var groups = {};

		groups.findAll = function () {
			return Object.create(request).method('get');
		};

		groups.findById = function (id) {
			return Object.create(request).method('get').path(id);
		};

		groups.create = function () {
			return Object.create(request).method('post');
		};

		groups.delete = function (id) {
			return Object.create(request).method('delete').path(id);
		};

		groups.update = function (id) {
			return Object.create(request).method('put').path(id);
		};

		return groups;
	};

	//export
	return service;

});