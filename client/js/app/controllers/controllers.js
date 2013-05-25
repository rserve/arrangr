/*
 * Register controllers
 * */

define([ 'app/app',
	'./GroupView',
	'./GroupsView',
	'./VersionController'
], function (app, GroupView, GroupsView, VersionController) {

	'use strict';

	app.controller('GroupView', GroupView);
	app.controller('GroupsView', GroupsView);
	app.controller('VersionController', VersionController);

});