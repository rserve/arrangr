define(function (require, exports, module) {

    'use strict';

	var app = require('app'),
        Home = require('./Home'),
		Group = require('./Group'),
		Groups = require('./Groups'),
		Logout = require('./Logout'),
        Verify = require('./Verify'),
		DemoForm = require('./DemoForm');

	//add all controllers
	app.controller('Home', Home).
        controller('Group', Group).
		controller('Groups', Groups).
		controller('Logout', Logout).
        controller('Verify', Verify).
		controller('DemoForm', DemoForm);

	//no export
});