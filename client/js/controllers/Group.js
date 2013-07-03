define(function (require, exports, module) {

	'use strict';

	var Controller = function ($scope, $filter, $location, $routeParams, groupsClient) {

		var key = $routeParams.groupId,
			client = groupsClient;

		function getGroup() {
			client.findByKey(key,
				function (group) {
					$scope.group = group;
                    $scope.link = $location.absUrl();
                    if($scope.user) {
                        for(var i in group.members) {
                            if(group.members[i].user == $scope.user.id) {
                                $scope.groupMember = group.members[i];
                                break;
                            }
                        }
                    }
					$scope.status = 'info';
				},
				function (data) {
					$scope.message = "Server says '" + data.error + "'";
					$scope.status = 'error';
				});
		}


		function joinGroup() {

			//get group
			client.findByKey(key,
				function (group) {

					//update count
					group.count = group.count + 1;
					delete group._id; //else update fails

					client.update(key).data(group).execute();

					$scope.group = group;
					$scope.status = 'success';
					$scope.message = 'joined group';

				});

		}


		function leaveGroup() {
			//get group
			client.findByKey(key, function (group) {

				//update group
				group.count = group.count - 1;
				if (group.count < 0) {
					group.count = 0;
				}
				delete group._id;

				client.update(key, group);

				$scope.group = group;
				$scope.status = 'success';
				$scope.message = 'leaved group';
			});
		}

        function changeMemberStatus(status) {
            client.updateMember($scope.groupMember.id, { status: status },
                function() {
                    // do nothing since we already updated the client
                },
                function(data) {
                    $scope.status = 'error';
                    $scope.message = "Server says '" + data.error + "'";
                }
            );
            $scope.groupMember.status = status;
        }

		$scope.leave = leaveGroup;
		$scope.join = joinGroup;

        $scope.yes = function() {
            changeMemberStatus('Yes');
        };

        $scope.no = function() {
            changeMemberStatus('No');
        };

        $scope.maybe = function() {
            changeMemberStatus('Maybe');
        };

        $scope.statusCount = function(status) {
            var c = 0;
            if($scope.group) {
                for(var i in $scope.group.members) {
                    if($scope.group.members[i].status == status) {
                        c++;
                    }
                }
            }
            return c;
        };

		getGroup();

	};

	//inject dependencies
	Controller.$inject = ['$scope', '$filter', '$location', '$routeParams', 'groupsClient', '$rootScope'];

	module.exports = Controller;

});
