define(function (require, exports, module) {

	'use strict';

	var _ = require('underscore');
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

	var commentForm = baseForm.create();

	commentForm.addField({
		validator: 'notEmpty',
		name: 'text',
		customError: 'Comment cannot be empty.'
	});

	var groupForm;

	var Controller = function ($scope, $state, $stateParams, groupsClient, authState, flash) {

		var key = $stateParams.groupId,
			client = groupsClient;

		commentForm.initialize($scope, 'commentForm');
		inviteForm.initialize($scope, 'inviteForm');
		joinForm.initialize($scope, 'joinForm');

		function getGroup() {
			client.findByKey(key,
				function (group) {
					$scope.group = group;
					$scope.currentMember = group.member($scope.user);

					groupForm = baseForm.create();
					groupForm.
						addField({
							name: 'public',
							initialValue: group.public,
							validator: null
						}).
						addField({
							name: 'name',
							initialValue: group.name,
							customError: 'Name cannot be empty'
						}).
						addField({
							name: 'description',
							initialValue: group.description,
							validator: null
						}).
						addField({
							name: 'weekday',
							initialValue: group.weekday()
						}).
						addField({
							name: 'time',
							initialValue: group.time()
						});

					groupForm.initialize($scope, 'groupForm');
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

//        $scope.public = function ($event) {
//            var
// checked = $event.target.checked;
//            client.update(key, {public: checked},
//                function () {
//                    // do nothing§
//                },
//                function (data) {
//                    flash.error = data.message;
//                }
//            );
//            $scope.group.public = checked;
//        };

		$scope.update = function () {
			var errors = groupForm.validate();
			if (errors) {
				flash.error = errors[0].message;
			} else {
				var data = groupForm.toJSON();
				var startDate = $scope.group.startDate ? new Date($scope.group.startDate) : new Date();

				if (data.weekday) {
					var current = $scope.group.weekday() || new Date().getDay();
					var diff = current - data.weekday;
					startDate.setDate(startDate.getDate() - diff);
					delete data.weekday;
				}

				if (data.time) {
					var t = data.time.split(':');
					startDate.setHours(t[0]);
					startDate.setMinutes(t[1]);
					delete data.time;
				}

				data.startDate = startDate;

				client.update(key, data,
					function (data) {
						$scope.group = data;
						flash.success = 'Meetup updated';
					},
					function (data) {
						flash.error = data.message;
					});
			}
		};

		$scope.invite = function () {
			var errors = inviteForm.validate();
			if (errors) {
				flash.error = errors[0].message;
			} else {
				client.invite(key, inviteForm.toJSON(),
					function (data) {
						$scope.group = data;
						flash.success = 'User invited';
						inviteForm.clear();
					},
					function (data) {
						flash.error = data.message;
					}
				);
			}
		};

		$scope.join = function (user) {
			var data,
				register;


			if (!user) {
				register = true;
				var errors = joinForm.validate();
				if (errors) {
					flash.error = errors[0].message;
				} else {
					data = joinForm.toJSON();
				}
			} else {
				register = false;
			}

			client.join(key, data,
				function (group) {
					$scope.group = group;
					if (register) {
						authState.refreshUserState();
						flash.success = 'An account as be created for you, please check your mail to verify.';
					} else {
						flash.success = 'You have joined the meetup';
						joinForm.clear();
					}
					$scope.currentMember = group.member($scope.user);
				},
				function (data) {
					// TODO: Better validation error handling
					if (data.name == 'ValidationError' && data.messages.email.type == 'Email already exists') {
						flash.success = 'Email is already registered, %sign in:/% first to join this group';
					} else {
						flash.success = data.message;
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
					$scope.group = data;
					flash.success = 'Member removed';
				},
				function (data) {
					flash.error = data.message;
				}
			);
		};

		$scope.addComment = function () {
			var errors = commentForm.validate();
			if (errors) {
				flash.error = errors[0].message;
			} else {
				var data = _.extend(commentForm.toJSON(), {
					author: $scope.currentMember.user.displayName()
				});

				client.addComment(key, data,
					function (data) {
						$scope.group = data;
						flash.success = 'Comment added';
						commentForm.clear();
					},
					function (data) {
						flash.error = data.message;
					}
				);
			}
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

		getGroup();
	};

	//inject dependencies
	Controller.$inject = ['$scope', '$state', '$stateParams', 'groupsClient', 'authState', 'flash'];

	module.exports = Controller;

});
