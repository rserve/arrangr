define(function (require, exports, module) {

    'use strict';

    var baseForm = require('framework/form/baseForm');




    var Controller = function ($scope, $rootScope, $state, $stateParams, usersClient, authState, flash) {

        var profileForm = baseForm.create();
        var passwordForm = baseForm.create();

        profileForm.addField({
            initialValue: $rootScope.user.name,
            name: 'name',
            validator: null
        });

//        profileForm.addField({
//            initialValue: $rootScope.user.email,
//            name: 'email'
//        });

        profileForm.addField({
            initialValue: $rootScope.user.gravatar,
            name: 'gravatar',
            validator: null
        });

        passwordForm.addField({
            name: 'password',
            validator: 'passwordweak'
        });

        passwordForm.addField({
            name: 'password2',
            validator: 'passwordweak'
        });


        profileForm.initialize($scope, 'profileForm');
        passwordForm.initialize($scope, 'passwordForm');

        $scope.save = function() {
            var errors = profileForm.validate();
            if(errors) {
                errors = errors.concat(passwordForm.validate());
            } else {
                errors = passwordForm.validate();
            }
            if (errors) {
                flash.error = errors[0].message;
            } else {
                var data = profileForm.toJSON();
                var password = passwordForm.getField('password').getValue();
                if(password) {
                    if(password != passwordForm.getField('password2').getValue()) {
                        flash.error = 'Passwords must match';
                        return;
                    }
                    data.password = password;
                }

                usersClient.update($rootScope.user.id, data,
                    function(user) {
                        authState.setUserState(user);
                        flash.success = 'Profile updated';
                        passwordForm.clear();
                    },
                    function(data) {
                        flash.error = data.message;
                    }
                );
            }
        };

    };

    Controller.$inject = ['$scope', '$rootScope', '$state', '$stateParams', 'usersClient', 'authState', 'flash'];


    module.exports = Controller;

});