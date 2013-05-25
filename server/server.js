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
		},
		{
			"id": 3,
			"name": "coding jam",
			"count": 1337
		},
		{
			"id": 4,
			"name": "spelkväll",
			"count": 66
		}
	];

	//grab group data dirty style
	function getGroupData(groupId) {

		var filtered = groups.filter(function (group) {
			return group.id == groupId; //automatic type conversion
		});

		return filtered.length > 0 && filtered[0]; //if match only one element in array
	}

	app.get('/groups', function (req, res) {
		res.json(groups);
	});

	app.get('/groups/:id', function (req, res) {
		var id = req.params.id,
			data = getGroupData(id);

		res.json(data);
	});

	app.use(express.static('client'));

	app.listen(3000);

	console.log('Listening on port 3000');

}();