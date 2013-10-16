/*
 * baseForm.js
 *
 * A class representing a web form bound to angular an controller scope.
 * Provides abstracted functionality to configure and validate form elements.
 *
 * */

define(function (require, exports, module) {

	'use strict';

	///////////////////////////////////////////////////
	//	DEPENDENCIES
	///////////////////////////////////////////////////

	var fieldFactory = require('./fields/fieldFactory'),
		_ = require('underscore');

	///////////////////////////////////////////////////
	//	PRIVATES
	///////////////////////////////////////////////////

	/*
	 * Filters for selecting fields.
	 * */
	var filters = {
		matchingGroup: function (group) {
			return function (field) {
				return field.group === group || !group; //if no group id was provided, treat as match
			};
		},
		matchingName: function (name) {
			return function (field) {
				return field.name === name;
			};
		}
	};

	///////////////////////////////////////////////////
	//	METHODS
	///////////////////////////////////////////////////

	var baseForm = {

		/*
		 * Create a field from configuration and add to form.
		 * */
		addField: function (config) {
			var field = fieldFactory.create(config);
			this.fields.push(field);

			return this; // chainable
		},

		getField: function (name) {
			var fields = this.getFields().filter(filters.matchingName(name));
			return fields && fields[0]; //should only have one match
		},

		getFields: function (group) {
			return this.fields.filter(filters.matchingGroup(group));
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
				error = field.validate(); //note: field will set error internally on itself
			}

			return error;
		},


		toJSON: function (group) {

			var json = {};

			this.getFields(group).forEach(function (field) {

				// grab value if not empty
				if (!field.isEmpty()) {
					json[field.name] = field.getValue();
				} else {
                    json[field.name] = null;
                }
			});

			return json;
		},

		/*
		* Initialize form for an angular scope, provide name for namespacing.
		* */
		initialize: function ($scope, name) {

			this.name = name;

			this.clear(); // fail safe
			this.bindForm($scope);

			this.bindOnChangeListeners($scope);

		},

		/*
		* Bind this form to angular scope
		* */
		bindForm: function ($scope) {
			$scope[this.name] = this;
		},

		/*
		 * Register listeners to changes on form fields.
		 * A change will be triggered when the form element value changes,
		 * for inputs and selects it would be 'value', for checkbox it would be 'checked'
		 * */
		bindOnChangeListeners: function ($scope) {

			var _this = this;

			this.getFields().forEach(function (field) {

				// create the angular watch string for the field
				var watchMe = '[form].getField("[name]").[attr]'.
					replace('[form]', _this.name).
					replace('[name]', field.name).
					replace('[attr]', field.getBoundAttribute());

				$scope.$watch(watchMe, function (value) {

					//TODO register a pub sub here to open up for subscriptions in controllers.
					//remove any error messages if input becomes empty
					if (field.isEmpty()) {
						field.clear();
					}
				});

			});


		},

		/*
		 * Clear all fields in form (remove any errors and reset value).
		 * */
		clear: function (group) {

			this.getFields(group).forEach(function (field) {
				field.clear();
                field.init();
			});
		}


	};

	///////////////////////////////////////////////////
	//	EXPORT
	///////////////////////////////////////////////////

	/*
	 * Export constructor method to force instantiation
	 * */
	exports.create = function () {

		var form = Object.create(baseForm);
		form.fields = []; // fields needs to be created on instance
		return  form;
	};
});