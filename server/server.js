// Module dependencies
var express = require('express');
var fs = require('fs');
var passport = require('passport');
var http = require('http');
var socket = require('./socket');

process.env.TZ = 'Europe/Stockholm';

// Load configurations
// if test env, load example file
var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];
var mongoose = require('mongoose');

if(config.mandrill) {
	process.env['MANDRILL_APIKEY'] = config.mandrill;
}

// Connect to DB
mongoose.connect(config.db);

// Bootstrap models
var modelsPath = __dirname + '/models';
fs.readdirSync(modelsPath).forEach(function (file) {
    require(modelsPath + '/' + file);
});

// bootstrap passport config
require('./config/passport')(passport, config);

// Setup express
var app = express();
var server = http.createServer(app);

// express settings
require('./config/express')(app, config, passport);

var port = process.env.PORT || config.port;
console.log('Express app started on port ' + port);
server.listen(port);
socket.listen(server);
/*global exports:true*/
exports = module.exports = app;