/**!
 * @license angular-flash v0.1.8
 * Copyright (c) 2013 William L. Bunselmeyer. https://github.com/wmluke/angular-flash
 * License: MIT
 */
/* global angular */

(function () {
    'use strict';

    var Flash = function (options) {
        var _options = angular.extend({
            classnames: {
                error: [],
                warn: [],
                info: [],
                success: []
            }
        }, options);

        var _self = this;
        var _subscribers = [];
        var _success;
        var _info;
        var _warn;
        var _error;
        var _type;

        function _notify(type, message) {
            angular.forEach(_subscribers, function (subscriber) {
                if (!subscriber.type || subscriber.type === type) {
                    subscriber.cb(message, type);
                }
            });
        }

        this.clean = function () {
            _subscribers = [];
            _success = null;
            _info = null;
            _warn = null;
            _error = null;
            _type = null;
        };

        this.subscribe = function (subscriber, type) {
            _subscribers.push({
                cb: subscriber,
                type: type
            });
        };

        Object.defineProperty(this, 'success', {
            get: function () {
                return _success;
            },
            set: function (message) {
                _success = message;
                _type = 'success';
                _notify(_type, message);
            }
        });

        Object.defineProperty(this, 'info', {
            get: function () {
                return _info;
            },
            set: function (message) {
                _info = message;
                _type = 'info';
                _notify(_type, message);
            }
        });

        Object.defineProperty(this, 'warn', {
            get: function () {
                return _warn;
            },
            set: function (message) {
                _warn = message;
                _type = 'warn';
                _notify(_type, message);
            }
        });

        Object.defineProperty(this, 'error', {
            get: function () {
                return _error;
            },
            set: function (message) {
                _error = message;
                _type = 'error';
                _notify(_type, message);
            }
        });

        Object.defineProperty(this, 'type', {
            get: function () {
                return _type;
            }
        });

        Object.defineProperty(this, 'message', {
            get: function () {
                return _type ? _self[_type] : null;
            }
        });

        Object.defineProperty(this, 'classnames', {
            get: function () {
                return _options.classnames;
            }
        });
    };

    angular.module('angular-flash.service', [])
        .provider('flash', function () {
            var _self = this;
            this.errorClassnames = ['alert-error'];
            this.warnClassnames = ['alert-warn'];
            this.infoClassnames = ['alert-info'];
            this.successClassnames = ['alert-success'];

            this.$get = function () {
                return new Flash({
                    classnames: {
                        error: _self.errorClassnames,
                        warn: _self.warnClassnames,
                        info: _self.infoClassnames,
                        success: _self.successClassnames
                    }
                });
            };
        });

}());

/* global angular */

(function () {
    'use strict';

    function isBlank(str) {
        if (str === null || str === undefined) {
            str = '';
        }
        return (/^\s*$/).test(str);
    }

    function flashAlertDirective(flash, $timeout) {
        return {
            scope: true,
            link: function ($scope, element, attr) {
                var handle;

                $scope.flash = {};

                $scope.hide = function () {
                    $scope.flash = {};
                    removeAlertClasses();
                    if (!isBlank(attr.activeClass)) {
                        element.removeClass(attr.activeClass);
                    }
                };

                $scope.$on('$destroy', function () {
                    flash.clean();
                });

                function removeAlertClasses() {
                    var classnames = [].concat(flash.classnames.error, flash.classnames.warn, flash.classnames.info, flash.classnames.success);
                    angular.forEach(classnames, function (clazz) {
                        element.removeClass(clazz);
                    });
                }

                function show(message, type) {
                    if (handle) {
                        $timeout.cancel(handle);
                    }

                    $scope.flash.type = type;
                    $scope.flash.message = message;
                    removeAlertClasses();
                    angular.forEach(flash.classnames[type], function (clazz) {
                        element.addClass(clazz);
                    });

                    if (!isBlank(attr.activeClass)) {
                        element.addClass(attr.activeClass);
                    }

                    var delay = Number(flash.duration || (attr.duration || 5000));
                    if (delay > 0) {
                        handle = $timeout($scope.hide, delay);
                    }
                }

                flash.subscribe(show, attr.flashAlert);

                /**
                 * Fixes timing issues: display the last flash message sent before this directive subscribed.
                 */

                if (attr.flashAlert && flash[attr.flashAlert]) {
                    show(flash[attr.flashAlert], attr.flashAlert);
                }

                if (!attr.flashAlert && flash.message) {
                    show(flash.message, flash.type);
                }

            }
        };
    }

    angular.module('angular-flash.flash-alert-directive', ['angular-flash.service'])
        .directive('flashAlert', ['flash', '$timeout', flashAlertDirective]);

}());