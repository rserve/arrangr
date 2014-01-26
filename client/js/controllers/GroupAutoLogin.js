define(function (require, exports, module) {

	'use strict';

	var Controller = function ($scope, $state, $stateParams, groupsClient, authState) {

		var key = $stateParams.groupId,
			hash = $stateParams.userHash;

		groupsClient.login(key, hash, function(user) {
			sessionStorage.setItem("user", user.id);
			authState.refreshUserState();
			$state.transitionTo('group', $stateParams);
		}, function(err) {
			$state.transitionTo('home');
		});
	};

	//inject dependencies
	Controller.$inject = ['$scope', '$state', '$stateParams', 'groupsClient', 'authState'];

	module.exports = Controller;
});
