/*
* Register controllers
* */

 'use strict';

define([ 'app',
	'controllers/GroupView'
], function (app, GroupView) {

	app.controller('GroupView', GroupView);

	return app;
});