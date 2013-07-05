define(function (require, exports, module) {

	'use strict';

    var baseForm = require('framework/form/baseForm');


    var inviteForm = baseForm.create();

	inviteForm.addField({
        validator: 'email',
        name: 'email',
        customError: 'Please enter a valid email'
    });

    var joinForm = baseForm.create();

    joinForm.addField({
        validator: 'email',
        name: 'email',
        customError: 'Please enter a valid email'
    });

	var Controller = function ($scope, $filter, $location, $routeParams, groupsClient, authState) {

		var key = $routeParams.groupId,
			client = groupsClient;

        inviteForm.initialize($scope, 'inviteForm');
        joinForm.initialize($scope, 'joinForm');

		function getGroup() {
			client.findByKey(key,
				function (group) {
					$scope.group = group;
                    $scope.link = $location.absUrl();
                    $scope.member = group.member($scope.user);
					$scope.status = 'info';
				},
				function (data) {
					$scope.message = "Server says '" + data.error + "'";
					$scope.status = 'error';
				});
		}

        function changeMemberStatus(status) {
            client.updateMember($scope.member.id, { status: status },
                function() {
                    // do nothing since we already updated the client
                },
                function(data) {
                    $scope.status = 'error';
                    $scope.message = "Server says '" + data.error + "'";
                }
            );
            $scope.member.status = status;
        }

        $scope.yes = function() {
            changeMemberStatus('Yes');
        };

        $scope.no = function() {
            changeMemberStatus('No');
        };

        $scope.maybe = function() {
            changeMemberStatus('Maybe');
        };

        $scope.public = function($event) {
            var checked = $event.target.checked;
            client.update(key, {public: checked},
                function() {
                    $scope.message = '';
                },
                function(data) {
                    $scope.status = 'error';
                    $scope.message = data.message;
                }
            );
            $scope.group.public = checked;
        };

        $scope.invite = function() {
            var errors = inviteForm.validate();
            if (errors) {
                $scope.status = 'error';
                $scope.message = errors[0].message;
            } else {
                client.invite(key, inviteForm.toJSON(),
                    function(data) {
                        $scope.group = data;
                        $scope.status = 'success';
                        $scope.message = 'User invited to group';
                        inviteForm.clear();
                    },
                    function(data) {
                        $scope.status = 'error';
                        $scope.message = data.message;
                    }
                );
            }
        };

        $scope.join = function(user) {
            var data;

            if(!user) {
                var errors = joinForm.validate();
                if (errors) {
                    $scope.status = 'error';
                    $scope.message = errors[0].message;
                } else {
                    data = joinForm.toJSON();
                }
            }

            client.join(key, data,
                function(data) {
                    $scope.group = data;
                    $scope.status = 'success';
                    $scope.message = 'You have joined the group';
                    joinForm.clear();
                    authState.refreshUserState();
                },
                function(data) {
                    $scope.status = 'error';
                    $scope.message = data.message;
                }
            );
        };

		getGroup();

	};

	//inject dependencies
	Controller.$inject = ['$scope', '$filter', '$location', '$routeParams', 'groupsClient', 'authState'];

	module.exports = Controller;

});
