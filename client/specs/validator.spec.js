/*global describe, it, expect */
define(function (require, exports, module) {

	var formValidator = require('controllers/form/validatorManager'),
		baseValidators = require('controllers/form/validators');

	'use strict';

	var _ = require('underscore');

	describe('Form Validator', function () {

		beforeEach(function () {

		});

		it('should be possible to add config', function () {

			formValidator.addConfig({foo: 'bar'});
			formValidator.addConfig({hello: 'world'});
			expect(formValidator.config['foo']).toEqual('bar');
			expect(formValidator.config['hello']).toEqual('world');
		});

		it('should be possible to add validator', function () {
			var validator = {type: 'testing', text: 'hello from validator'};
			formValidator.addValidator(validator);

			expect(formValidator.validators['testing'].text).toEqual('hello from validator');
		});

		describe('validate', function () {
			it('should throw error when validator is not found', function () {
				var exception;
				try {
					formValidator.validate({myParam: 'johnDoe'});
				} catch (e) {
					exception = e;
				}

				expect(exception).toBeDefined();

			});

			it('should call method of correct validator', function () {
				var validator = {type: 'isNonEmpty', validate: function () {
				}};

				formValidator.addConfig({myParam: 'isNonEmpty'});
				formValidator.addValidator(validator);

				spyOn(validator, 'validate');

				formValidator.validate({myParam: 'johnDoe'});

				expect(validator.validate).toHaveBeenCalled();
			});

			it('should call method of another correct validator', function () {
				var validator = {type: 'test', validate: function () {
				}};

				formValidator.addConfig({anotherParam: 'test'});
				formValidator.addValidator(validator);

				spyOn(validator, 'validate');

				formValidator.validate({anotherParam: 'johnDoe'});

				expect(validator.validate).toHaveBeenCalled();
			});

			/*it('should not return errors on valid data', function () {
				formValidator.addConfig({myParam: 'email'});
				formValidator.addValidator(baseValidators.email);

				var errors = formValidator.validate({myParam: 'test@email.com'});

				expect(errors).toBeUndefined();
			});*/

			it('should return correct errors on invalid data', function () {
				formValidator.addConfig({myParam: 'email'});
				formValidator.addValidator(baseValidators.email);

				var errors = formValidator.validate({myParam: 'test@email'});
				console.log(errors);
				expect(errors).toBeDefined();
			});
		});

		describe('Base validators', function () {

			describe('notEmpty', function () {

				it('should return true on not empty string', function () {
					var msg = baseValidators.notEmpty.validate("i am not empty");
					expect(msg).toEqual(true);
				});

				it('should return false on empty string', function () {
					var msg = baseValidators.notEmpty.validate();
					expect(msg).toEqual(false);
				});
			});

			describe('email', function () {

				it('should return true on not valid email', function () {
					var msg = baseValidators.email.validate("test@email.com");
					expect(msg).toEqual(true);
				});

				it('should return false on invalid email', function () {
					var msg = baseValidators.email.validate("@broken");
					expect(msg).toEqual(false);
				});
			});
		});
	});

});
