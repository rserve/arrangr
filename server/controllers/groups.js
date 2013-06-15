var mongoose = require('mongoose');
var e = require('./errorhandler');
var Group = mongoose.model('Group');

exports.findAll = function (req, res) {
    Group.find(function (err, groups) {
        e(err, res, 'Error finding groups') || res.send(groups);
    });
};

exports.findByUser = function (req, res) {
    var user = req.user;
    Group.find({'members.user': user}, function (err, groups) {
        e(err, res, 'Error finding groups by user') || res.send(groups);
    });
};

exports.find = function (req, res) {
    res.send(req.group);
};

exports.create = function (req, res) {
    var group = req.body;
    group.members = [
        { user: req.user, admin: true, status: 'Yes' }
    ];
    Group.create(group, function (err, group) {
        e(err, res, 'Error creating group') || res.send(group);
    });
};

exports.update = function (req, res) {
    var group = req.body;
    Group.findOneAndUpdate({_id: req.group.id}, group, function (err) {
        e(err, res, 'Error updating group') || res.send(group);
    });
};

exports.delete = function (req, res) {
    req.group.remove(function (err) {
        e(err, res, 'Error removing group') || res.send();
    });
};

exports.join = function (req, res) {
    var user = req.user;
    var group = req.group;

    Group.find({ _id: group.id, 'members.user': user}, function (err, groups) {
        if (!e(err, res, 'Error joining group')) {
            if (groups.length > 0) {
                res.status(409).send({error: 'Already a member of this group'});
            } else {
                Group.findOneAndUpdate({_id: group.id }, { $addToSet: { members: { user: user } } },
                    function (err, groupt) {
                        e(err, res, 'Error joining group') || res.send(group);
                    }
                );
            }
        }
    });
};

// param parsing
var fromParam = function (req, res, next, q) {
    Group.findOne(q, function (err, group) {
        if (!e(err, res, 'Error finding group')) {
            if (!group) {
                res.status(404).send({error: 'Group not found'});
            } else {
                req.group = group;
                next();
            }
        }
    });
};

exports.fromKey = function (req, res, next, key) {
    fromParam(req, res, next, { key: key });
};

exports.fromId = function (req, res, next, id) {
    fromParam(req, res, next, { _id: id });
};