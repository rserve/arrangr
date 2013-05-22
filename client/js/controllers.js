function GroupViewController($scope, $http) {

	$http.get('data/group.json').success(function (data) {
		$scope.group = data;
	});
}