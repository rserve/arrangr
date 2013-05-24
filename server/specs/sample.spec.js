/*global describe, it, expect */
module.exports = function Calculator() {

	var calculator = require('../calculator.js');

	describe("Calculator", function () {

		describe("add()", function () {
			it("should add two numbers together", function () {
				var numOne = 2;
				var numTwo = 6;
				var expectedResult = 8;

				var actualResult = calculator.add(numOne, numTwo);

				expect(actualResult).toEqual(expectedResult);
			});
		});
	});
}();