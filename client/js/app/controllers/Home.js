define(['framework/logger'], function (logger) {

    'use strict';

    var Controller = function ($scope, $http, $location, users) {

        $scope.submit = function (user) {
            console.log(user);
            users.login().data(user).
                success(function (res) {
                    console.log('success', res);
                    $location.path( "/groups" );
                }).
                error(function (res) {
                    console.log('error', res);
                    alert('fuck off');
                }).execute();

        };

        $scope.user = {email: '', password: ''};
    };

    Controller.$inject = ['$scope', '$http', '$location', 'users'];
    //export
    return Controller;

});
