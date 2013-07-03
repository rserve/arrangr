define(function (require, exports, module) {

	'use strict';

	var fieldFactory = require('./fields/fieldFactory'),
		_ = require('underscore');

	/*
	 * Filters for selecting fields
	 * */
	var filters = {
		matchingGroup: function (group) {
			return function (field) {
				return field.group === group || !group; //if no group id was provided, treat as match
			}
		},
		matchingName: function (name) {
			return function (field) {
				return field.name === name;
			}
		}
	};

	var baseForm = {

		addField: function (config) {
			var field = fieldFactory.create(config);
			this.fields.push(field);

		},

		getField: function (name) {
			var fields = this.getFields().filter(filters.matchingName(name));
			return fields && fields[0]; //should only have one match
		},

		getFields: function (group) {
			return  this.fields.filter(filters.matchingGroup(group));
		},

		validate: function (group) {
			var fields = this.getFields(group),
				error,
				errors;

			fields.forEach(function (field) {
				error = field.validate();

				if (error) {
					errors = errors || [];
					error.name = field.name; // store name of field so we tie error to field
					errors.push(error);
				}
			});

			return errors;
		},


		validateField: function (name) {
			var field = this.getField(name),
				error;

			//remove validation text if field is empty
			if (field.isEmpty()) {
				field.clear();
			} else {
				error = field.validate();
			}

			return error;
		},

		toJSON: function (group) {

			var json = {};

			this.getFields(group).forEach(function (field) {

				// grab value if not empty
				if (!field.isEmpty()) {
					json[field.name] = field.getValue();
				}
			});

			return json;
		},


		initialize: function ($scope, config) {
			this.bindForm($scope);

			this.bindOnChangeListeners($scope);

		},


		bindForm: function ($scope) {
			$scope.form = this;
		},

		bindOnChangeListeners: function ($scope) {

			this.getFields().forEach(function (field) {

				$scope.$watch('baseForm.getField("[name]").[attr]'.replace('[name]', field.name).replace('[attr]', field.getBoundAttribute()), function (value) {
					if (field.isEmpty()) {
						field.clear();
					}
				});

			});


		},

		clear: function (group) {

			this.getFields(group).forEach(function (field) {
				field.clear();
			});
		}


	};

	exports.create = function () {

		var form = Object.create(baseForm);
		form.fields = [];
		return  form;
	};
});