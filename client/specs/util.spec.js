/*global describe, it, expect */
define(['util'], function (util) {


	'use strict';

	describe('date util', function () {

		describe('format date', function () {


			it('should return', function () {

				var stamp = util.date.formatDate(new Date(), '%H:%m:%s.%S');

				expect(stamp).not.toBeUndefined();

			});
		});
	});

});
