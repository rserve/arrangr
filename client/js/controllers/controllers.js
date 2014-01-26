define(function (require, exports, module) {

    'use strict';

	var app = require('app'),
        Home = require('./Home'),
		Group = require('./Group'),
		Groups = require('./Groups'),
		Logout = require('./Logout'),
        Password = require('./Password'),
		Profile = require('./Profile'),
		EditGroup = require('./EditGroup'),
		GroupAutoLogin = require('./GroupAutoLogin');

	app.controller('Home', Home).
        controller('Group', Group).
		controller('Groups', Groups).
		controller('Logout', Logout).
        controller('Password', Password).
		controller('Profile', Profile).
		controller('EditGroup', EditGroup).
		controller('GroupAutoLogin', GroupAutoLogin);

});