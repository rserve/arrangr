define(function (require, exports, module) {

    'use strict';

	var app = require('app'),
        Home = require('./Home'),
		Group = require('./Group'),
		Groups = require('./Groups'),
		Logout = require('./Logout'),
        Verify = require('./Verify'),
		Profile = require('./Profile');

	app.controller('Home', Home).
        controller('Group', Group).
		controller('Groups', Groups).
		controller('Logout', Logout).
        controller('Verify', Verify).
		controller('Profile', Profile);

});