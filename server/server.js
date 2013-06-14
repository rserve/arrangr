// Module dependencies
var express = require('express');
var fs = require('fs');
var passport = require('passport');

// Load configurations
// if test env, load example file
var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];
var auth = require('./config/middlewares/authorization');
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

// express settings
require('./config/express')(app, config, passport);

// Bootstrap routes
require('./config/routes')(app, passport, auth);

var port = process.env.PORT || 3000;
app.listen(port);
console.log('Express app started on port ' + port);

/*global exports:true*/
exports = module.exports = app;