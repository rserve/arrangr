define(function (require, exports, module) {

	'use strict';

	var app = require('app/app'),
		JoinGroup = require('./JoinGroup'),
		Group = require('./Group'),
		Groups = require('./Groups'),
		Login = require('./Login'),
		Logout = require('./Logout'),
		Register = require('./Register'),
		UserInfo = require('./UserInfo');

	//add all controllers
	app.controller('Group', Group).
		controller('JoinGroup', JoinGroup).
		controller('Groups', Groups).
		controller('Register', Register).
		controller('Login', Login).
		controller('Logout', Logout).
		controller('UserInfo', UserInfo);

	//no export
});