define(['framework/logger'], function (logger) {

    'use strict';

    var Controller = function ($scope, $http, $location, users) {

        $scope.login = function (user) {
            users.login().data(user).
                success(function (res) {
                    console.log('success', res);
                    sessionStorage.setItem("user", JSON.stringify(user));
                    $location.path("/groups");
                }).
                error(function (res) {
                    console.log('error', res);
                    alert('fuck off');
                }).execute();

        };

        $scope.signUp = function (user) {
            users.create().data(user).
                success(function (res) {
                    console.log('success', res);
                    sessionStorage.setItem("user", JSON.stringify(user));
                    $location.path("/groups");
                }).
                error(function (res) {
                    console.log('error', res);
                    alert('registration failed, fuck off');
                }).execute();

        };

        function logout() {
            users.logout().
                success(function (res) {
                    console.log('success', res);
                    sessionStorage.setItem("user", '');
                    $location.path("/login");
                }).
                error(function (res) {
                    console.log('error', res);
                    alert('logout failed, fuck off');
                }).execute();

        }


        $scope.user = {email: '', password: ''};
        $scope.isLogin = ($location.path().indexOf('login') !== -1);
        if (($location.path().indexOf('logout') !== -1)) {
            logout();
        }

    };

    Controller.$inject = ['$scope', '$http', '$location', 'users'];
//export
    return Controller;

})
;
