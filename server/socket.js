var socketIO = require('socket.io');
var io = null;

exports.listen = function (server) {
	io = socketIO.listen(server, {
		'log level': 2
	});

	io.sockets.on('connection', onConnection);

	return io;
};

exports.groupChanged = function (group) {
	io.sockets.emit('groupChanged', createMessage(group._id, group));
};

function onConnection(socket) {

	var client = socket.handshake.address;

	log('connected: ' + client.address + ':' + client.port);

	socket.on('disconnect', function () {
		log('disconnected');
	});


}

function createMessage(id, data) {

	return {
		id: id,
		data: data || null
	};
}

function log(message) {

	console.log('[socket]', message);
}
