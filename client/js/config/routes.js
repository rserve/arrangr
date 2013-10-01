define(function (require, exports, module) {

    'use strict';

    var app = require('app'),
        partials = require('./partials');

    //access levels
    var access = {
        public: 1,
        anon: 2,
        auth: 3
    };

    app.
        config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function ($stateProvider, $locationProvider, $urlRouterProvider) {

            //push state
            $locationProvider.html5Mode(true);

            $urlRouterProvider.otherwise("/404");

            //Layout
            $stateProvider.state('default', {
                abstract: true,
                views: {
                    '': {
                        templateUrl: partials.layout
                    },
                    'header@default': {
                        templateUrl: partials.header
                    }
                }
            });

            //Pages
            $stateProvider
                .state('home', {
                    url: '/',
                    controller: 'Home',
                    templateUrl: partials.home,
                    access: access.anon
                })
                .state('groups', {
                    url: '/groups',
                    parent: 'default',
                    views: {
                        content: {
                            controller: 'Groups',
                            templateUrl: partials.groups
                        }
                    },
                    access: access.auth
                })
                .state('group', {
                    url: '/groups/:groupId',
                    parent: 'default',
                    views: {
                        content: {
                            controller: 'Group',
                            templateUrl: partials.group
                        }
                    },
                    access: access.public
                })
                .state('404', {
                    url: '/404',
                    parent: 'default',
                    views: {
                        content: {
                            templateUrl: partials.notFound
                        }
                    },
                    access: access.public
                })
                .state('verify', {
                    url: '/verify/:verificationHash',
                    parent: 'default',
                    views: {
                        content: {
                            controller: 'Verify'
                        }
                    },
                    access: access.public
                })
                .state('profile', {
                    url: '/profile',
                    parent: 'default',
                    views: {
                        content: {
                            controller: 'Profile',
                            templateUrl: partials.profile
                        }
                    },
                    access: access.auth
                })
                .state('logout', {
                    url: '/logout',
                    controller: 'Logout',
                    access: access.auth
                });

            console.log('Routes configured');

        }])

        .run(['$rootScope', '$state', '$stateParams', 'authState', function ($rootScope, $state, $stateParams, authState) {

            $rootScope.$on("$stateChangeStart", function (event, to, toParam, from, fromParams) {
                $rootScope.error = null;

                //If trying to access authenticated page not logged in, redirect to home
                if (to.access === access.auth && !authState.isAuth()) {
                    event.preventDefault();
                    $state.transitionTo('home');
                }
                //If trying to access anonymous page logged in, redirect to groups
                else if (to.access === access.anon && authState.isAuth()) {
                    event.preventDefault();
                    $state.transitionTo('groups');
                }
            });

            console.log('Route intercepts configured');
        }]);

    module.exports = app;
});
