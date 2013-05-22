/*
* Register controllers
* */

define([ 'app',
	'controllers/GroupView',
	'controllers/GroupsView'
], function (app, GroupView, GroupsView) {

	'use strict';

	app.controller('GroupView', GroupView);
	app.controller('GroupsView', GroupsView);

});