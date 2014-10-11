var mongoose = require('mongoose');
var e = require('../helpers/errorhandler');
var Group = mongoose.model('Group');
var User = mongoose.model('User');
var hash = require('../helpers/hash');
var mailer = require('../helpers/mailer');
var image = require('../helpers/image');
var socket = require('../socket');
var moment = require('moment');
var _ = require('underscore');

//Fields from user to populate into member array
var userFields = 'id name email verified hashedEmail gravatar image';
var validBodyKeys = ['name', 'description', 'startDate', 'endDate', 'public', 'minParticipants', 'maxParticipants', 'incrementDays'];
var validMemberKeys = ['status'];
var validAdminMemberKeys = ['admin'];

var filterValidKeys = function (o) {
    return _.pick(o, validBodyKeys);
};

exports.findAll = function (req, res) {
    Group.find(function (err, groups) {
        e(err, res, 'Error finding groups') || res.send(groups);
    });
};

exports.findByUser = function (req, res) {
    var user = req.user;
    var now = new Date();
    Group.find({startDate: { $gt: now } }).or([
        {'members.user': user},
        { public: true }
    ]).sort({ startDate: 'desc'}).exec(function (err, groups) {
        e(err, res, 'Error finding groups by user') || res.send(groups);
    });
};

exports.archive = function (req, res) {
    var user = req.user;
    Group.aggregate({
        $match: {
            startDate: { $lt: new Date() }
        }
    }, {
        $project: {
            key: 1,
            name: 1,
            startDate: 1,
            members: 1
        }
    }, {
        $unwind: "$members"
    }, {
        $sort: {
            startDate: -1
        }
    }, {
        $group: {
            _id: { id: "$_id", key: "$key" },
            name: {
                $first: "$name"
            },
            startDate: {
                $first: "$startDate"
            },
            participants: {
                $sum: {
                    $cond: [
                        { $eq: [ "$members.status", "Yes" ] },
                        1,
                        0
                    ]
                }
            }
        }
    }, {
        $sort: {
            startDate: -1
        }
    }, {
        $group: {
            _id: "$_id.key",
            id: {
                $first: "$_id.id"
            },
            name: {
                $first: "$name"
            },
            startDate: {
                $first: "$startDate"
            },
            count: {
                $sum: 1
            },
            participants: {
                $avg: "$participants"
            }
        }
    }, {
        $sort: {
            startDate: -1
        }
    })
        .exec(function (err, results) {
            for (var i = 0; i < results.length; i++) {
                results[i].participants = Math.round(results[i].participants);
            }
            e(err, res, 'Error creating group archive') || res.send(results);
        });
};

exports.find = function (req, res) {
    res.send(req.group);
};

exports.create = function (req, res) {
    var group = filterValidKeys(req.body);
    group.createdBy = req.user.id;
    group.members = [
        { user: req.user.id, admin: true, status: 'Yes' }
    ];
    Group.create(group, function (err, group) {
        if (!e(err, res, 'Error creating group')) {
            socket.groupChanged(group);
            res.send(group);
        }

    });
};

exports.update = function (req, res) {
    _.extend(req.group, filterValidKeys(req.body));
    req.group.save(function (err, group, numRows) {
        if (!e(err, res, 'Error updating group')) {
            socket.groupChanged(group);
            res.send(group);
        }
    });
};

exports.delete = function (req, res) {
    req.group.remove(function (err) {
        e(err, res, 'Error removing group') || res.send();
    });
};

exports.updateMember = function (req, res) {
    var body = _.pick(req.body, validMemberKeys);
    var data = {};

    if (req.group.isAdmin(req.user)) {
        _.extend(body, _.pick(req.body, validAdminMemberKeys));
    }

    _.each(body, function (value, key) {
        key = 'members.$.' + key;
        data[key] = value;
    });

    Group.findOneAndUpdate({'members._id': req.params.memberId }, data).
        populate('members.user', userFields).
        populate('comments.user', userFields).
        exec(function (err, group) {
            if (!e(err, res, 'Error updating groupmember')) {
                if (!group) {
                    res.status(404).send({error: 'Error updating groupmember', message: 'Groupmember not found'});
                } else {
                    socket.groupChanged(group);
                    res.send(group);
                }
            }
        });
};

exports.deleteMember = function (req, res) {
    var group = req.group;
    Group.findOneAndUpdate({ _id: group.id }, { '$pull': { members: { _id: req.params.memberId } } }).
        populate('members.user', userFields).
        populate('comments.user', userFields).
        exec(function (err, group) {
            if (!e(err, res, 'Error removing member from group')) {
                socket.groupChanged(group);
                res.send(group);
            }
        }
    );
};

exports.join = function (req, res) {
    var group = req.group;

    if (!req.user) {
        if (!group.public) {
            return res.status(403).send({error: 'Error joining group', message: 'Group is private'});
        }
        var email = req.body.email;
        if (!email) {
            return res.status(500).send({error: 'Error joining group', message: 'Email missing'});
        }

        User.create({ email: email }, function (err, user) {
            if (!e(err, res, 'Error creating user')) {
                mailer.sendRegistrationMail(user);
                addUserToGroup(req, res, group, user);
            }
        });
    } else {
        addUserToGroup(req, res, group, req.user, 'Yes');
    }
};

var addUserToGroup = function (req, res, group, user, status) {
    Group.find({ _id: group.id, 'members.user': user.id}, function (err, groups) {
        if (!e(err, res, 'Error finding group to join')) {
            if (groups.length > 0) {
                res.status(409).send({error: 'Error when joining group', message: 'Already a member of this group'});
            } else {
                Group.findOneAndUpdate({_id: group.id }, { $addToSet: { members: { user: user.id, status: status } } }).
                    populate('members.user', userFields).
                    populate('comments.user', userFields).
                    exec(function (err, group) {
                        if (!e(err, res, 'Error joining group')) {
                            socket.groupChanged(group);
                            res.send(group);

                            if (req.user && req.user.id != user.id) {
                                mailer.sendInvitationMail(user, group, req.user);
                            }
                        }
                    }
                );
            }
        }
    });
};

exports.invite = function (req, res) {
    var email = req.body.email;
    var group = req.group;
    User.findOne({email: email}, function (err, user) {
        if (!e(err, res, 'Error finding invited user')) {
            if (!user) {
                User.create({ email: email }, function (err, user) {
                    if (!e(err, res, 'Error creating invited user')) {
                        addUserToGroup(req, res, group, user);
                    }
                });
            } else {
                addUserToGroup(req, res, group, user);
            }
        }
    });
};

exports.uploadThumbnail = function (req, res) {
    //TODO: Real validation
    if (!req.files || !req.files.thumbnail) {
        res.status(500).send('Missing thumbnail file');
        return;
    }

    var thumbnail = req.files.thumbnail;

    var format = thumbnail.headers['content-type'];

    if (format.indexOf('image') == -1) {
        res.status(500).send('Only images allowed');
        return;
    }

    if (thumbnail.size > 1000 * 1000) {
        res.status(500).send('File too big: ' + thumbnail.size);
        return;
    }

    image.thumbnail(thumbnail.path, { size: 100, remove: true }, function (err, buffer) {
        if (err) {
            if (err.code === -1) {
                res.status(500).send('Error resizing image');
            } else {
                res.status(500).send(err);
            }
        } else {
            var image = {
                data: "data:" + format + ";base64," + buffer.toString('base64'),
                format: format,
                size: thumbnail.size
            };

            Group.findOneAndUpdate({_id: req.group.id}, { image: image }).
                populate('members.user', userFields).
                populate('comments.user', userFields).
                exec(function (err, group) {
                    if (!e(err, res, 'Error uploading thumbnail')) {
                        socket.groupChanged(group);
                        res.send(group);
                    }
                });
        }
    });
};

exports.addComment = function (req, res) {
    var group = req.group;
    User.findOne({_id: req.body.userRefId}, function (err, user) {

        Group.findOneAndUpdate({ _id: group.id }, {
            $addToSet: {
                comments: {
                    text: req.body.text,
                    user: user.id
                }
            }
        }).
            populate('members.user', userFields).
            populate('comments.user', userFields).
            exec(function (err, group) {
                if (!e(err, res, 'Error adding comment')) {
                    socket.groupChanged(group);
                    res.send(group);
                }
            }
        );
    });
};

exports.deleteComment = function (req, res) {
    var group = req.group;
    Group.findOneAndUpdate({ _id: group.id }, { '$pull': { comments: { _id: req.params.commentId } } }).
        populate('comments.user', userFields).
        populate('members.user', userFields).
        exec(function (err, group) {
            if (!e(err, res, 'Error removing comment from group')) {
                socket.groupChanged(group);
                res.send(group);
            }
        }
    );
};

exports.increment = function (req, res) {
    if(moment(req.group.startDate).isAfter()) {
        return res.status(403).send({ error: 'Error incrementing group', message: 'Group has not happened yet' });
    }

    var group = req.group.toJSON();
    delete group.id;
    delete group.createdAt;
    while(moment(group.startDate).isBefore()) {
        group.startDate = moment(group.startDate).add('days', group.incrementDays || 7).toDate();
    }
    if (group.endDate) {
        while(moment(group.endDate).isBefore()) {
            group.endDate = moment(group.endDate).add('days', group.incrementDays || 7).toDate();
        }
    }
    group.comments = [];
    group.members.forEach(function (member) {
        delete member.id;
        delete member.createdAt;
        delete member._hash;
        member.status = '';
        member.user = member.user.id;
    });
    Group.create(group, function (err, group) {
        if (!e(err, res, 'Error creating next group cycle')) {
            socket.groupChanged(group);
            res.send(group);
        }
    });
};

exports.remindAll = function (req, res) {
    req.group.members.forEach(function (member) {
        if (!member.status.match('(Yes|No)')) {
            mailer.sendReminderMail(member, req.group);
        }
    });
    res.send();
};

exports.remindMember = function (req, res) {
    var memberId = req.params.memberId;
    req.group.members.some(function (member) {
        if (member.id == memberId && !member.status.match('(Yes|No)')) {
            mailer.sendReminderMail(member, req.group);
            return true;
        }
        return false;
    });
    res.send();
};

exports.status = function (req, res) {
    req.group.members.forEach(function (member) {
        if (member.status.match('(Yes|No|Maybe)')) {
            mailer.sendStatusMail(member, req.group);
        }
    });
    res.send();
};

exports.autoLogin = function (req, res) {
    if (req.body.hash) {
        var found = false;
        req.group.members.forEach(function (member) {
            if (req.body.hash == member._hash) {
                found = true;
                req.logIn(member.user, function (err) {
                    if (!e(err, res, 'Error auto logging in user')) {
                        res.send(member);
                    }
                });
            }
        });
        if (!found) {
            res.status(404).send({error: 'Error auto logging in user', message: 'Invalid hash'});
        }
    }
};

// param parsing
var fromParam = function (req, res, next, q) {
    var query = Group.findOne(q).sort({ startDate: 'desc'});
    /*if (req.user) {
     query.or([
     {'members.user': req.user },
     { 'public': true }
     ]);
     } else {
     query.where('public', true);
     }*/

    query.
        populate('members.user', userFields).
        populate('comments.user', userFields).
        exec(function (err, group) {
            if (!e(err, res, 'Error finding group')) {
                if (!group) {
                    next(new Error('Group not found'));
                } else {
                    req.group = group;
                    next();
                }
            }
        });

};

exports.fromKey = function (req, res, next, key) {
    var q;
    if (key.length < 24) {
        q = { key: key };
    } else {
        q = { _id: key };
    }
    fromParam(req, res, next, q);
};