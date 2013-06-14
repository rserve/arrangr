/*
 * Register controllers
 * */

define(function (require, exports, module) {

    'use strict';

    var app = require('app/app'),
        GroupView = require('./GroupView'),
        GroupsView = require('./GroupsView'),
        Home = require('./Home');

    //add all controllers
    app.controller('GroupView', GroupView).
        controller('GroupsView', GroupsView).
        controller('Home', Home);

    //no export
});