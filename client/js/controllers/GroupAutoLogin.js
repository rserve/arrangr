define(function (require, exports, module) {

	'use strict';

	var Controller = function ($scope, $state, $stateParams, groupsClient, authState, flash) {

		var key = $stateParams.groupId,
			hash = $stateParams.userHash,
            response = $stateParams.response;

		groupsClient.login(key, hash, function(member) {
			sessionStorage.setItem("user", member.user.id);
			authState.refreshUserState();
            if(response && response.match(/yes|maybe|no/)) {
                groupsClient.updateMember(key, member._id, { status: response.charAt(0).toUpperCase() + response.substring(1).toLowerCase() },
                    function () {
                        $state.transitionTo('group', $stateParams);
                    },
                    function (data) {
                        flash.error = data.message;
                    }
                );
            } else {
                $state.transitionTo('group', $stateParams);
            }
		}, function(err) {
			$state.transitionTo('home');
		});
	};

	//inject dependencies
	Controller.$inject = ['$scope', '$state', '$stateParams', 'groupsClient', 'authState', 'flash'];

	module.exports = Controller;
});
