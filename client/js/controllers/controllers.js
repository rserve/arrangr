define(function (require, exports, module) {

    'use strict';

	var app = require('app'),
        Home = require('./Home'),
		Group = require('./Group'),
		GroupEdit = require('./GroupEdit'),
		GroupAutoLogin = require('./GroupAutoLogin'),
		Groups = require('./Groups'),
		Logout = require('./Logout'),
        Password = require('./Password'),
		Profile = require('./Profile');

	app.controller('Home', Home).
        controller('Group', Group).
		controller('GroupEdit', GroupEdit).
		controller('GroupAutoLogin', GroupAutoLogin).
		controller('Groups', Groups).
		controller('Logout', Logout).
        controller('Password', Password).
		controller('Profile', Profile);

});