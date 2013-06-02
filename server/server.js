module.exports = function () {

	var express = require('express');
    var mongoose = require('mongoose');
    var groups = require('./routes/groups');

    // Connect to DB
    mongoose.connect('mongodb://localhost/' + (process.env.DB_NAME || 'rserve'));

    // Setup express
    var app = express();
    app.configure(function(){
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.compress());
    });

    // Routes
	app.get('/api/groups', groups.findAll);
	app.get('/api/groups/:id', groups.findById);
    app.post('/api/groups', groups.create);
    app.put('/api/groups/:id', groups.update);
    app.delete('/api/groups/:id', groups.delete);

    // Route all requests that's not for static files (ending with .*) to the index page and let angular do the client routing
    app.use(function(req, res, next) {
        if (!req.url.match(/.*\..*/)) {
            req.url = '/';
        }
        next();
    });

    // Serve client files
	app.use(express.static('client'));

	app.listen(process.env.PORT || 3000);

}();