// Module dependencies
var express = require('express');
var namespace = require('express-namespace');
var fs = require('fs');
var passport = require('passport');

var http = require('http');

var socket = require('./socket');

// Load configurations
// if test env, load example file
var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];
var auth = require('./config/middlewares/authorization');
var mongoose = require('mongoose');

process.env['MANDRILL_APIKEY'] = config.mailer.apikey;

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

// Bootstrap routes
require('./config/routes')(app, passport, auth);

var port = process.env.PORT || 3000;
//app.listen(port);
console.log('Express app started on port ' + port);
server.listen(port);
socket.listen(server);
/*global exports:true*/
exports = module.exports = app;