define(function (require, exports, module) {

	'use strict';

	var factory = [ '$rootScope', function ($rootScope) {


		return {

			isAuth: function () {
				return !!this.getUserState();
			},


			getUserState: function () {
				var userString = sessionStorage.getItem("user"),
					user;
				if (userString) {
					user = JSON.parse(userString);
				}
				return user;
			},

			refreshUserState: function () {
				var user = this.getUserState();
				$rootScope.user = user;
				console.log('User state refreshed:', user?user:' no user');
			},

			setUserState: function (user) {
				sessionStorage.setItem("user", JSON.stringify(user));
				$rootScope.user = user;

				console.log('User state stored', user);

			},

			removeUserState: function () {
				sessionStorage.removeItem("user");
				$rootScope.user = null;
				console.log('User state removed');
			}
		};
	}];

	module.exports = factory;

});
