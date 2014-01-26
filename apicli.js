var args = process.argv.splice(2);
var env = process.env.NODE_ENV || 'development';
var config = require('./server/config/config')[env];
var request = require('request');

var baseUrl = 'http://localhost:' + config.port + '/api/';

if(args[0]) {
	var url = baseUrl + args[0];
	console.log('Requesting ' + url);
	request(url, function(err, res) {
		if(err) {
			console.log('Error:', err);
		} else {
			console.log('Status:', res.statusCode);
		}
	});
}