/*global describe, it, expect */

define(function (require, exports, module) {

	'use strict';

	describe('sample spec', function () {

		it('should join array', function () {

			var arr = ['j', 'o', 'i', 'n', 'e', 'd'],
				str = arr.join('');

			expect(str).toEqual('joined');
		});
	});

});
