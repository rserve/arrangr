// Module dependencies
var express = require('express');
var fs = require('fs');
var passport = require('passport');
var http = require('http');
//var socket = require('./socket');

// Load configurations
// if test env, load example file
var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];
var mongoose = require('mongoose');

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
server.listen(port);
/*global exports:true*/
//socket.listen(server);
console.log('App started on port ' + port);
exports = module.exports = app;