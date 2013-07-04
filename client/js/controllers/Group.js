define(function (require, exports, module) {

	'use strict';

    var baseForm = require('./form/baseForm'),
        fieldFactory = require('./form/fields/fieldFactory');


    var inviteForm = baseForm.create();
    inviteForm.addField(fieldFactory.createInput({
        validator: 'email',
        name: 'email',
        placeholder: 'Invite member'
    }));

    var joinForm = baseForm.create();
    joinForm.addField(fieldFactory.createInput({
        validator: 'email',
        name: 'email',
        placeholder: 'Enter your email'
    }));

	var Controller = function ($scope, $filter, $location, $routeParams, groupsClient, authState) {

		var key = $routeParams.groupId,
			client = groupsClient;

        inviteForm.initialize($scope, 'inviteForm');
        joinForm.initialize($scope, 'joinForm');

        inviteForm.onFieldValidate = function (name, field, error) {
            if (!error) {
                field.setMessage('success', '');
            }
        };

        joinForm.onFieldValidate = function (name, field, error) {
            if (!error) {
                field.setMessage('success', '');
            }
        };

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
            var errors = inviteForm .validateAll();
            if(!errors) {
                client.invite(key, inviteForm.toJSON(),
                    function(data) {
                        $scope.group = data;
                        $scope.message = '';
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
                var errors = joinForm .validateAll();
                if(!errors) {
                    data = joinForm.toJSON();
                }
            }

            client.join(key, data,
                function(data) {
                    $scope.group = data;
                    $scope.message = '';
                    authState.refreshUserState();
                },
                function(data) {
                    $scope.status = 'error';
                    $scope.message = data.message;
                    authState.refreshUserState();
                }
            );
        };

		getGroup();

	};

	//inject dependencies
	Controller.$inject = ['$scope', '$filter', '$location', '$routeParams', 'groupsClient', 'authState'];

	module.exports = Controller;

});
