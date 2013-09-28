define(function (require, exports, module) {

	'use strict';

	var app = require('app'),
		Group = require('./Group'),
		Groups = require('./Groups'),
		Logout = require('./Logout'),
        Verify = require('./Verify'),
		UserInfo = require('./UserInfo'),
		DemoForm = require('./DemoForm'),
		Home = require('./Home');

	//add all controllers
	app.controller('Group', Group).
		controller('Groups', Groups).
		controller('Logout', Logout).
        controller('Verify', Verify).
		controller('UserInfo', UserInfo).
		controller('DemoForm', DemoForm).
		controller('Home', Home);

	//no export
});