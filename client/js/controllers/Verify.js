define(function (require, exports, module) {

    'use strict';

    var Controller = function ($scope, $http, $state, $stateParams, usersClient, authState) {

        var hash = $stateParams.verificationHash;

        usersClient.verify(hash, function (user) {
                $scope.status = 'success';
                $scope.message = 'Your email has been verified, continue to %group:/groups% page';
                authState.setUserState(user);
            },
            function (data) {
                $scope.status = 'error';
                $scope.message = data.error;
            }
        );
    };

    Controller.$inject = ['$scope', '$http', '$state', '$stateParams', 'usersClient', 'authState'];


    module.exports = Controller;

});
