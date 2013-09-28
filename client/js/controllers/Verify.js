define(function (require, exports, module) {

    'use strict';

    var Controller = function ($scope, $http, $state, $stateParams, usersClient, authState, flash) {

        var hash = $stateParams.verificationHash;

        usersClient.verify(hash, function (user) {
                flash.success = 'Your email has been verified, please %sign in:/% to continue';
                //Logout just in case another user is logged in
                if(authState.isAuth()) {
                    usersClient.logout();
                    authState.removeUserState();
                }
            },
            function (data) {
                flash.duration = 0;
                flash.error = data.error;
            }
        );
    };

    Controller.$inject = ['$scope', '$http', '$state', '$stateParams', 'usersClient', 'authState', 'flash'];


    module.exports = Controller;

});