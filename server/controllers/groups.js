var mongoose = require('mongoose');
var e = require('../helpers/errorhandler');
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
    Group.findOneAndUpdate({_id: req.group.id}, group, function (err, group) {
        e(err, res, 'Error updating group') || res.send(group);
    });
};

exports.delete = function (req, res) {
    req.group.remove(function (err) {
        e(err, res, 'Error removing group') || res.send();
    });
};

exports.updateMember = function(req, res) {
    var status = req.body.status;
    Group.findOneAndUpdate({'members._id': req.params.memberId }, { 'members.$.status' : status }, function(err, group) {
        if(!e(err, res, 'Error updating groupmember')) {
            if(!group) {
                res.status(404).send({error: 'Error updating groupmember', message: 'Groupmember not found'});
            } else {
                res.send(group);
            }
        }
    });
};

exports.join = function (req, res) {
    var user = req.user;
    var group = req.group;

    Group.find({ _id: group.id, 'members.user': user}, function (err, groups) {
        if (!e(err, res, 'Error joining group')) {
            if (groups.length > 0) {
                res.status(409).send({error: 'Error when joining gorup', message: 'Already a member of this group'});
            } else {
                Group.findOneAndUpdate({_id: group.id }, { $addToSet: { members: { user: user } } },
                    function (err, group) {
                        e(err, res, 'Error joining group') || res.send(group);
                    }
                );
            }
        }
    });
};

// param parsing
var fromParam = function (req, res, next, q) {
    Group.findOne(q).populate('members.user', 'id name email verfied').exec(function (err, group) {
        if (!e(err, res, 'Error finding group')) {
            if (!group) {
                res.status(404).send({error: 'Error finding group', message: 'Group not found'});
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