// Module dependencies
var express = require('express');
var fs = require('fs');

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

// Setup express
var app = express();

// express settings
require('./config/express')(app, config);

// Bootstrap routes
require('./config/routes')(app);

var port = process.env.PORT || 3000;
app.listen(port);
console.log('Express app started on port ' + port);

/*global exports:true*/
exports = module.exports = app;