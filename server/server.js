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

	var groups = [
		{
			"id": 1,
			"name": "innebandy!",
			"count": 2
		},
		{
			"id": 2,
			"name": "ostprovning",
			"count": 200
		}
	];

	app.get('/groups', function (req, res) {
		res.json(groups);
	});

	app.get('/groups/:id', function (req, res) {
		res.json(groups[1]);
	});

	app.use(express.static('client'));

	app.listen(3000);
	console.log('Listening on port 3000');

}();