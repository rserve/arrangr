/**
 * Created with JetBrains PhpStorm.
 * User: Calle
 * Date: 2013-05-23
 * Time: 21:31
 * To change this template use File | Settings | File Templates.
 */

module.exports = function () {

	var express = require('express');
	var app = express();
	var db = require('./fakeDB');

	app.get('/groups', function (req, res) {
		res.json(db.getGroups());
	});

	app.get('/groups/:id', function (req, res) {
		var id = req.params.id,
			data = db.getGroup(id);

		db.increaseGroupCount(id);

		res.json(data);
	});

	app.use(express.static('client'));

	app.listen(3000);

	console.log('Listening on port 3000');

}();