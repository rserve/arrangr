define(function (require, exports, module) {

    'use strict';

    var baseForm = require('framework/form/baseForm');




    var Controller = function ($scope, $rootScope, $state, $stateParams, usersClient, authState, flash) {

        var profileForm = baseForm.create();

        console.log($rootScope.user.name);

        profileForm.addField({
            initialValue: $rootScope.user.name,
            name: 'name'
        });

        profileForm.initialize($scope, 'profileForm');

        $scope.save = function() {
            var errors = profileForm.validate();
            if (errors) {
                flash.error = errors[0].message;
            } else {
                usersClient.update($rootScope.user.id, profileForm.toJSON(),
                    function(user) {
                        authState.setUserState(user);
                        flash.success = 'Profile updated';
                    },
                    function(data) {
                        flash.error = data.message;
                    }
                );
            }
        }

    };

    Controller.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'usersClient', 'authState', 'flash'];


    module.exports = Controller;

});