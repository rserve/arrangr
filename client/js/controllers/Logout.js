define(function (require, exports, module) {

	'use strict';

	var Controller = function ($scope, $http, $state, usersClient, authState) {


		usersClient.logout(function (res) {
				authState.removeUserState();
				$state.transitionTo('home');
			},
			function (res) {
				console.log('error', res);
			});
	};

	Controller.$inject = ['$scope', '$http', '$state', 'usersClient', 'authState'];

	module.exports = Controller;

});
