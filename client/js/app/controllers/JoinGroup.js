define(['framework/logger'], function (logger) {

    'use strict';

    var Controller = function ($scope, $filter, $location, $routeParams, groupsService, users) {


        var group = $routeParams.groupId,
            email = $routeParams.email;


        function joinGroup() {
            groupsService.join(group).
                success(function () {
                    $location.path("/groups/" + group);
                }).
                error(function (res) {
                    console.log('error', res);
                    if (res.status === 409) {
                        $location.path("/groups/" + group);
                    } else {
                        alert('fuck off');

                    }
                }).
                execute();
        }

        var form = {email: email, password: 'bajs'};

        var saveUserAndJoinGroup = function (user) {
            users.setUserState(user);

            joinGroup();

        };
        users.login().data(form).
            success(saveUserAndJoinGroup).
            error(function (res) {
                console.log('error', res);
                if (res.status === 404) {
                    register();
                } else {

                    alert('fuck off');
                }

            }).execute();

        function register() {
            users.create().data(form).
                success(saveUserAndJoinGroup).
                error(function (res) {
                    console.log('error', res);
                    alert('registration failed, fuck off');
                }).execute();
        }

    };


    //inject dependencies
    Controller.$inject = ['$scope', '$filter', '$location', '$routeParams', 'groupsService', 'users'];

    //export
    return Controller;

});
