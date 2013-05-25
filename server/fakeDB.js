(function () {

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


	//grab group data dirty style
	function increaseGroupCount(groupId) {

		var group = getGroupData(groupId);
		if (group) {
			group.count++;
		}
	}

	module.exports = {
		getGroup: getGroupData,
		getGroups: function () {
			return groups;
		},
		increaseGroupCount:increaseGroupCount
	};
})();