define(function (require, exports, module) {

	'use strict';

	var app = require('app');

	app.run(['socket', function (socket) {
		socket.forward('groupChanged');
		socket.forward('disconnect');

		socket.on('groupChanged', function (message) {
			console.log('[socket] groupChanged', message.data);
		});

		socket.on('disconnect', function () {
			console.log('[socket] disconnect');
		});
		console.log('Socket configured');
	}]);

	module.exports = app;
});

