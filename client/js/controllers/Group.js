define(function (require, exports, module) {

	'use strict';

	var _ = require('underscore');

	var angular = require('angular');

	var Group = require('../services/api/domain/Group');

	var Controller = function ($scope, $state, $stateParams, groupsClient, authState, flash, socket) {

		var key = $stateParams.groupId,
			client = groupsClient;

		function updateGroup(data) {
			$scope.group = data;
			resetGroupModel();
		}

		function getGroup() {
			client.findByKey(key,
				function (group) {
					updateGroup(group);
					$scope.currentMember = group.member($scope.user);

				},
				function (data) {
					flash.error = data.message;
				});
		}

		function changeMemberStatus(status) {
			client.updateMember(key, $scope.currentMember.id, { status: status },
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


		// keep model data for update group form separate from actual group object
		// (otherwise descriptions etc on page will be updated in real time when form fields is being edited)
		function resetGroupModel() {
			var model = $scope.groupModel = angular.copy({});
			model.name = $scope.group.name;
			model.description = $scope.group.description;
			model.public = $scope.group.public;
			model.time = $scope.group._time;
			model.weekday = $scope.group._weekday;


		}

		// why are we doing like this?
		function calculateStartDate() {
			var startDate = $scope.group.startDate ? new Date($scope.group.startDate) : new Date();

			var weekday = $scope.groupModel.weekday;
			if (weekday) {
				var current = $scope.group.weekday() || new Date().getDay();
				var diff = current - weekday;
				startDate.setDate(startDate.getDate() - diff);
			}

			var time = $scope.groupModel.time;

			if ($scope.groupModel.time) {
				var t = time.split(':');
				startDate.setHours(t[0]);
				startDate.setMinutes(t[1]);
			}

			return startDate;
		}


		$scope.update = function () {

			if ($scope.groupForm.$invalid) {
				if ($scope.groupForm.name.$invalid) {
					flash.error = 'Name cannot be empty';
				} else {
					flash.error = 'Please check form.';
				}

			} else {

				$scope.groupModel.startDate = calculateStartDate();

				client.update(key, $scope.groupModel,
					function (data) {
						updateGroup(data);
						flash.success = 'Meetup updated';
					},
					function (data) {
						flash.error = data.message;
					});
			}
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
						authState.refreshUserState();
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

		$scope.removeMember = function (member) {
			client.removeMember(key, member.id,
				function (data) {
					updateGroup(data);
					flash.success = 'Member removed';
				},
				function (data) {
					flash.error = data.message;
				}
			);
		};

		$scope.increment = function () {
			client.increment(key,
				function (data) {
					updateGroup(data);
					flash.success = 'Meetup updated to next cycle';
				},
				function (data) {
					flash.error = data.message;
				});
		};

		$scope.remind = function () {
			client.remind(key,
				function () {
					flash.success = 'Reminder sent';
				},
				function (data) {
					flash.error = data.message;
				});
		};

		$scope.addComment = function () {
			if ($scope.commentForm.comment.$invalid) {
				flash.error = 'Comment cannot be empty.';
			} else {
				var user = $scope.currentMember.user;
				var data = _.extend($scope.commentModel, {
					userRefId: user.id,
				});

				client.addComment(key, data,
					function (data) {
						updateGroup(data);
						flash.success = 'Comment added';
						$scope.commentModel.text = "";
					},
					function (data) {
						flash.error = data.message;
					}
				);
			}
		};

		$scope.deleteComment = function (comment) {

			client.deleteComment(key, comment.id,
				function (data) {
					updateGroup(data);

					flash.success = 'Comment deleted';
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

		$scope.$on('socket:groupChanged', function (ev, message) {

			// Should not replace group only update, breaks bindings when some relations are missing
			if (message.id === $scope.group.id) {
				updateGroup(groupsClient.parse(message.data));
			}

		});

		getGroup();
	};

	//inject dependencies
	Controller.$inject = ['$scope', '$state', '$stateParams', 'groupsClient', 'authState', 'flash', 'socket'];

	module.exports = Controller;

});
