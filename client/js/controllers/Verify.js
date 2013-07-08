define(function (require, exports, module) {

    'use strict';

    var Controller = function ($scope, $http, $location, $routeParams, usersClient, authState) {

        var hash = $routeParams.verificationHash;

        usersClient.verify(hash, function (user) {
                $scope.status = 'success';
                $scope.message = 'Your email has been verified, %sign in:/% to continue';
                authState.setUserState(user);
            },
            function (data) {
                $scope.status = 'error';
                $scope.message = data.error;
            }
        );
    };

    Controller.$inject = ['$scope', '$http', '$location', '$routeParams', 'usersClient', 'authState'];


    module.exports = Controller;

});
