module.exports = function () {

	var express = require('express');
    var groups = require('./api/groups');

    var app = express();
    app.use(express.bodyParser());
    app.use(express.compress());

    // API
    // Groups
	app.get('/api/groups', groups.findAll);
	app.get('/api/groups/:id', groups.findById);
    app.post('/api/groups', groups.create);
    app.put('/api/groups/:id', groups.update);
    app.delete('/api/groups/:id', groups.delete);

    // Serve client files
	app.use(express.static('client'));

	app.listen(process.env.PORT || 3000);

}();