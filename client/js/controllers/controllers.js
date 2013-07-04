define(function (require, exports, module) {

	'use strict';

	var app = require('app'),
		JoinGroup = require('./JoinGroup'),
		Group = require('./Group'),
		Groups = require('./Groups'),
		Login = require('./Login'),
		Logout = require('./Logout'),
		Register = require('./Register'),
		UserInfo = require('./UserInfo'),
		DemoForm = require('./DemoForm'),
		Home = require('./Home');

	//add all controllers
	app.controller('Group', Group).
		controller('JoinGroup', JoinGroup).
		controller('Groups', Groups).
		controller('Register', Register).
		controller('Login', Login).
		controller('Logout', Logout).
		controller('UserInfo', UserInfo).
		controller('DemoForm', DemoForm).
		controller('Home', Home);

	//no export
});