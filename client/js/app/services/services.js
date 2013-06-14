/* Services */

define(['app/app', './groups', './localization', './users'], function (app, groups, localization, users) {

    'use strict';

    app.factory('groupsService', groups).
        factory('users', users).
        factory('localization', localization);

    //no export
});
