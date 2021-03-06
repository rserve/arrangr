define(function (require, exports, module) {

	'use strict';

	var _ = require('underscore');

	var angular = require('angular');

	var Group = require('../services/api/domain/Group');

	var Controller = function ($scope, $rootScope, $state, $stateParams, groupsClient, authState, flash) {

		var id = $stateParams.groupId,
		    key = $stateParams.groupId,
			client = groupsClient;

		function updateGroup(data) {
			$scope.group = data;
            id = $scope.group.id;
            key = $scope.group.key;
			$rootScope.title = $scope.group.name;
			if($scope.group.description) {
				$rootScope.description = $scope.group.description.replace(/<[^>]+>/gm, '');
			}
		}

		function getGroup() {
			client.findByKey(key,
				function (group) {
					updateGroup(group);
					$scope.currentMember = group.member($scope.user);

				},
				function (data) {
					if(data.error == 'Unauthorized') {
						$rootScope.redirectTo = { to: $state.current, toParam: $stateParams };
						$state.transitionTo('home');
					} else {
						flash.error = data.message;
					}
				});
		}

		function changeMemberStatus(status) {
			client.updateMember(id, $scope.currentMember.id, { status: status },
				function () {
					// do nothing since we already updated the client
				},
				function (data) {
					flash.error = data.message;
				}
			);
			$scope.currentMember.status = status;
		}

		$scope.yes = function () {
			changeMemberStatus('Yes');
		};

		$scope.no = function () {
			changeMemberStatus('No');
		};

		$scope.maybe = function () {
			changeMemberStatus('Maybe');
		};


		$scope.invite = function () {
			if ($scope.inviteForm.$invalid) {
				flash.error = 'Please enter a valid email';
			} else {
				client.invite(key, $scope.inviteModel,
					function (data) {
						updateGroup(data);
						flash.success = 'User invited';
						$scope.inviteModel.email = "";
					},
					function (data) {
						flash.error = data.message;
					}
				);
			}
		};

		$scope.join = function (user) {
			var register;

			if (!user) {
				register = true;

				if ($scope.joinForm.$invalid) {
					flash.error = 'Please enter a valid email';
					return;
				}

			} else {
				register = false;
			}

			client.join(key, $scope.joinModel,
				function (group) {
					updateGroup(group);
					if (register) {
						flash.success = 'An account as be created for you, please check your mail to verify.';
						if ($scope.joinModel) {
							$scope.joinModel.email = "";
						}
					} else {
						flash.success = 'You have joined the meetup';
					}
					$scope.currentMember = group.member($scope.user);
				},
				function (data) {
					// TODO: Better validation error handling
					if (data.name == 'ValidationError' && data.messages.email.type == 'Email already exists') {
						flash.success = 'Email is already registered, %sign in:/% first to join this group';
					} else {
						flash.error = data.message;
					}
				}
			);
		};

		$scope.leave = function (member) {
			client.removeMember(key, member.id,
				function (data) {
					flash.success = 'You have left the meetup';
					$state.transitionTo('groups');
				},
				function (data) {
					flash.error = data.message;
				}
			);
		};

		$scope.remindAll = function () {
			client.remindAll(key,
				function () {
					flash.success = 'Reminder sent';
				},
				function (data) {
					flash.error = data.message;
				});
		};

        $scope.remindMember = function (member) {
            client.remindMember(key, member.id,
                function () {
                    flash.success = 'Reminder sent';
                },
                function (data) {
                    flash.error = data.message;
                });
        };

        $scope.increment = function () {
            client.increment(key,
                function (data) {
                    $state.transitionTo("group", { groupId: data.key });
                    flash.success = 'Meetup updated to next cycle';
                },
                function (data) {
                    flash.error = data.message;
                });
        };

		$scope.status = function () {
			client.status(key,
				function () {
					flash.success = 'Status sent';
				},
				function (data) {
					flash.error = data.message;
				});
		};

        $scope.visibleMembers = function() {
            var n = 0;
            if($scope.group) {
                var group = $scope.group;
                if ($scope.showAllMembers) {
                    n = group.members.length;
                } else {
                    n = group.statusCount('Yes') + group.statusCount('Maybe') + group.statusCount('No');
                }
            }
            return n;
        };

        $scope.showAllMembers = false;

        $scope.toggleShowAllMembers = function() {
            $scope.showAllMembers = true;
        };

		$scope.addComment = function () {
			if ($scope.commentForm.comment.$invalid) {
				flash.error = 'Comment cannot be empty.';
			} else {
				var user = $scope.currentMember.user;
				var data = _.extend($scope.commentModel, {
					userRefId: user.id
				});

				client.addComment(id, data,
					function (data) {
						updateGroup(data);
						//flash.success = 'Comment added';
						$scope.commentModel.text = "";
					},
					function (data) {
						flash.error = data.message;
					}
				);
			}
		};

		$scope.deleteComment = function (comment) {

			client.deleteComment(id, comment.id,
				function (data) {
					updateGroup(data);

					//flash.success = 'Comment deleted';
				},
				function (data) {
					flash.error = data.message;
				}
			);

		};

		$scope.commentHelper = {
			increase: 10,
			visible: 5,
			total: function () {
				return $scope.group && $scope.group.comments.length;
			},
			showMore: function () {
				this.visible = Math.min(this.visible + this.increase, this.total());
			},
			more: function () {
				return  Math.min(this.total() - this.visible, this.increase);
			}


		};

		/*socket.on('groupChanged', function (message) {

			// Should not replace group only update, breaks bindings when some relations are missing
			if (message.id === id) {
				updateGroup(groupsClient.parse(message.data));
			}

		});*/

		getGroup();
	};

	//inject dependencies
	Controller.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'groupsClient', 'authState', 'flash'];

	module.exports = Controller;

});
