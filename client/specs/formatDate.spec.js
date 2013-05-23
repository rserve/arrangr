/*global describe, it, expect */
define(['tools/formatDate'], function (formatDate) {


	'use strict';

	describe('format date', function () {

		it('should return', function () {

			var stamp = formatDate(new Date(), '%H:%m:%s.%S');

			expect(stamp).not.toBeUndefined();

		});
	});

});
