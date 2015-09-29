var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];
var fs = require('fs');
var mongoose = require('mongoose');

// Connect to DB
mongoose.connect(config.db);

// Bootstrap models
var modelsPath = __dirname + '/models';
fs.readdirSync(modelsPath).forEach(function (file) {
    require(modelsPath + '/' + file);
});

var groups = require('./controllers/groups');

groups.cron({}, {
    send: function(data) {
        console.log(data);
        process.exit();
    },
    status: function(code) {
        console.log('Status code', code);
    }
});