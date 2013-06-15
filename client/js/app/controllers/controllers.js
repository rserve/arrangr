/*
 * Register controllers
 * */

define(function (require, exports, module) {

	'use strict';

	var app = require('app/app'),
		GroupView = require('./GroupView'),
		GroupsView = require('./GroupsView'),
		Login = require('./Login'),
		Logout = require('./Logout'),
		Register = require('./Register'),
		UserInfo = require('./UserInfo');

	//add all controllers
	app.controller('GroupView', GroupView).
		controller('GroupsView', GroupsView).
		controller('Register', Register).
		controller('Login', Login).
		controller('Logout', Logout).
		controller('UserInfo', UserInfo);

	//no export
});