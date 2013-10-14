define(function (require, exports, module) {

    'use strict';

    var factory = [ '$rootScope', '$injector', function ($rootScope, $injector) {

        var usersClient;

        return {

            isAuth: function () {
                return !!this.getUserState();
            },

            getUserState: function () {
                return sessionStorage.getItem("user");
            },

            refreshUserState: function () {
                if(this.getUserState()) {
                    var self = this;
                    // Inject at run because of circular dependancy
                    usersClient = usersClient || $injector.get('usersClient');
                    usersClient.session(
                        function (user) {
                            $rootScope.user = user;
                        }, function (err) {
                            console.log(err);
                            self.removeUserState();
                        }
                    );
                } else {
                    console.log('No user state found in browser');
                }
            },

            setUserState: function (user) {
                if (user) {
                    sessionStorage.setItem("user", user.id);
                    $rootScope.user = user;
                    console.log('User state stored', user);
                }
            },

            removeUserState: function () {
                if (this.getUserState()) {
                    sessionStorage.removeItem("user");
                    console.log('User state removed');
                }
                $rootScope.user = null;
            }
        };
    }];

    module.exports = factory;

});
