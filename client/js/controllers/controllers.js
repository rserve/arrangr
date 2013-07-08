define(function (require, exports, module) {

	'use strict';

	var app = require('app'),
		Group = require('./Group'),
		Groups = require('./Groups'),
		Login = require('./Login'),
		Logout = require('./Logout'),
		Register = require('./Register'),
        Verify = require('./Verify'),
		UserInfo = require('./UserInfo'),
		DemoForm = require('./DemoForm'),
		Home = require('./Home');

	//add all controllers
	app.controller('Group', Group).
		controller('Groups', Groups).
		controller('Login', Login).
		controller('Logout', Logout).
        controller('Register', Register).
        controller('Verify', Verify).
		controller('UserInfo', UserInfo).
		controller('DemoForm', DemoForm).
		controller('Home', Home);

	//no export
});