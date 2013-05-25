/*
 * Put all utility libs/methods in underscore
 * */

define(['underscore', 'framework/date'],
	function (underscore, date) {

		'use strict';

		underscore.date = date;

		return underscore;

	});