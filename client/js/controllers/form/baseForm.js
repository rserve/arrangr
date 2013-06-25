define(function (require, exports, module) {

	'use strict';

	var form = {

		fieldsForGroup: function (groupId) {
			var fields = [];
			this.forEachField(function (name, field) {
				if (field.group === groupId || !groupId) {
					fields.push(field);
				}
			});
			return fields;
		},

		addField: function (field) {
			this.fields[field.name] = field;
		},

		getField: function (name) {
			return this.fields[name];
		},

		validateGroup: function (group) {
			return this.validate(this.fieldsForGroup(group));
		},

		validateAll: function () {

			return this.validate(this.fieldsForGroup());
		},

		validate: function (fields) {

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

		forEachField: function (cb) {
			var fields = this.fields;
			for (var name in fields) {
				if (fields.hasOwnProperty(name)) {
					cb(name, fields[name]);
				}
			}
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

		toJSON: function () {
			var values = {}, value;
			this.forEachField(function (name, field) {
				value = field.getValue();
				if (value !== null) {
					values[name] = field.getValue();
				}
			});
			return values;
		},

		create: function () {
			var newForm = Object.create(form);
			newForm.fields = {};
			newForm.global = {};
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

			this.forEachField(function (name, field) {

				var boundAttribute = field.getBoundAttribute();
				$scope.$watch('form.fields.[name].[boundAttribute]'.replace('[name]', name).replace('[boundAttribute]', boundAttribute), function (value) {
					_this.validateField(name);
				}, true);
			});


		},

		reset: function () {
			this.forEachField(function (name, field) {
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