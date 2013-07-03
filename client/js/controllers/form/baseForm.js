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
				return field.group === group || !group; //if no group id was provided, match all
			}
		},
		matchingName: function (name) {
			return function (field) {
				return field.name === name;
			}
		}
	};

	var form = {

		global: {},

		fields: [],


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
			var fields = this.getFields(group);

			var error,
				errors;

			fields.forEach(function (field) {
				error = field.validate();

				if (error) {
					errors = errors || {};
					errors[field.name] = error;
				}
			});

			return errors;
		},


		validateField: function (name) {
			var field = this.getField(name);

			//remove validation text if field is empty
			if (field.isEmpty()) {
				field.reset();
				return;
			} else {
				var error = field.validate();
				this.onFieldValidate(name, field, error);
			}
		},

		toJSON: function (group) {
			var values = {},
				value,
				name;
			this.getFields(group).forEach(function (field) {
				value = field.getValue();
				name = field.name;
				if (value !== null) {
					values[name] = field.getValue();
				}
			});
			return values;
		},

		create: function () {
			var newForm = Object.create(form);

			return newForm;
		},

		initialize: function ($scope) {
			this.bindForm($scope);
			this.bindListeners($scope);
		},


		bindForm: function ($scope) {
			$scope.form = this;
		},

		bindListeners: function ($scope) {
			var _this = this;

			this.getFields().forEach(function (field) {

				var boundAttribute = field.getBoundAttribute();
				var name = field.name;
				$scope.$watch('form.getField("[name]").[boundAttribute]'.replace('[name]', name).replace('[boundAttribute]', boundAttribute), function (value) {
					_this.validateField(name);
				}, true);
			});


		},

		reset: function (group) {
			this.getFields(group).forEach(function (name, field) {
				field.reset();
			});

			this.global = {};
		},

///////////////////////////////////////////////////
//	TEMPLATE METHODS
///////////////////////////////////////////////////

		/*
		 * override this to hook into behavior
		 * */
		onFieldValidate: function (name, field, error) {

		}

	};

	module.exports = form;
});