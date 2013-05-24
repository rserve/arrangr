/*
 * Register controllers
 * */

define([ 'app/app',
	'app/controllers/GroupView',
	'app/controllers/GroupsView'
], function (app, GroupView, GroupsView) {

	'use strict';

	app.controller('GroupView', GroupView);
	app.controller('GroupsView', GroupsView);

});