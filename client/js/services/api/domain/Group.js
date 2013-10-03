define(function (require, exports, module) {

    'use strict';

    var _ = require('underscore');

    var Group = function (data) {
        _.extend(this, data);
    };

    var proto = Group.prototype;

    proto.isAdmin = function (user) {
        if (user) {
            for (var i = 0, len = this.members.length; i < len; i++) {
                var member = this.members[i];
                if (member.admin && member.user && (member.user === user.id || member.user.id === user.id)) {
                    return true;
                }
            }
        }
        return false;
    };

    proto.isMember = function (user) {
        return !!this.member(user);
    };

    proto.member = function (user) {
        if (user) {
            for (var i = 0, len = this.members.length; i < len; i++) {
                var member = this.members[i];
                if (member.user && (member.user === user.id || member.user.id === user.id)) {
                    return member;
                }
            }
        }
        return null;
    };

    proto.statusCount = function (status) {
        var c = 0;
        for (var i = 0, len = this.members.length; i < len; i++) {
            var member = this.members[i];
            if (member.status == status) {
                c++;
            }
        }
        return c;
    };

    proto.isNew = function () {
        return this.createdAt > (Date.now() - (60 * 60 * 24 * 3));
    };

    proto.weekday = function () {
        if(this.startDate) {
            var d = new Date(this.startDate);
            return d.getDay();
        }
        return null;
    };

    proto.time = function () {
        if(this.startDate) {
            var d = new Date(this.startDate);
            return d.getHours() + ':' + d.getMinutes();
        }
        return null;
    };

    module.exports = Group;
});