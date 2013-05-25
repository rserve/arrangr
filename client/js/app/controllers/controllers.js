/*
 * Register controllers
 * */

define([ 'app/app',
	'./GroupView',
	'./GroupsView',
	'./VersionController'
], function (app, GroupView, GroupsView, VersionController) {

	'use strict';

	//add all controllers
	app.controller('GroupView', GroupView).
		controller('GroupsView', GroupsView).
		controller('VersionController', VersionController);

	//no export
});