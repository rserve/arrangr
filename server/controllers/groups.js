var mongoose = require('mongoose');
var e = require('../helpers/errorhandler');
var Group = mongoose.model('Group');
var User = mongoose.model('User');
var hash = require('../helpers/hash');
var mailer = require('../helpers/mailer');
var image = require('../helpers/image');

//Fields from user to populate into member array
var userFields = 'id name email verified hashedEmail';

exports.findAll = function (req, res) {
    Group.find(function (err, groups) {
        e(err, res, 'Error finding groups') || res.send(groups);
    });
};

exports.findByUser = function (req, res) {
    var user = req.user;
    Group.find().or([{'members.user': user}, { public: true }]).exec(function (err, groups) {
        e(err, res, 'Error finding groups by user') || res.send(groups);
    });
};

exports.find = function (req, res) {
    res.send(req.group);
};

exports.create = function (req, res) {
    var group = req.body;
    group.createdBy = req.user;
    group.members = [
        { user: req.user, admin: true, status: 'Yes' }
    ];
    Group.create(group, function (err, group) {
        e(err, res, 'Error creating group') || res.send(group);
    });
};

exports.update = function (req, res) {
    var group = req.body;
    Group.findOneAndUpdate({_id: req.group.id}, group).populate('members.user', userFields).exec(function (err, group) {
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

exports.deleteMember = function(req, res) {
    var group = req.group;
    Group.findOneAndUpdate({ _id: group.id }, { '$pull': { members: { _id: req.params.memberId } } }).populate('members.user', userFields).exec(
        function (err, group) {
            if(!e(err, res, 'Error removing member from group')) {
                res.send(group);
            }
        }
    );
};

exports.join = function (req, res) {
    var group = req.group;

    if(!req.user) {
        var email = req.body.email;
        if(!email) {
            return res.status(500).send({error: 'Error joining group', message: 'Email missing'});
        }

        User.create({ email: email, password: hash.gen(5) }, function (err, user) {
            if (!e(err, res, 'Error creating user')) {
                mailer.sendRegistrationMail(user);
                req.logIn(user, function (err) {
                    e(err, res, 'Error when logging in') || addUserToGroup(res, group, user);
                });
            }
        });
    } else {
        addUserToGroup(res, group, req.user, 'Yes');
    }
};

var addUserToGroup = function(res, group, user, status) {
    Group.find({ _id: group.id, 'members.user': user}, function (err, groups) {
        if (!e(err, res, 'Error finding group to join')) {
            if (groups.length > 0) {
                res.status(409).send({error: 'Error when joining gorup', message: 'Already a member of this group'});
            } else {
                Group.findOneAndUpdate({_id: group.id }, { $addToSet: { members: { user: user, status: status } } }).populate('members.user', userFields).exec(
                    function (err, group) {
                        if(!e(err, res, 'Error joining group')) {
                            res.send(group);
                            mailer.sendInvitationMail(user);
                        }
                    }
                );
            }
        }
    });
};

exports.invite = function(req, res) {
    var email = req.body.email;
    var group = req.group;
    User.findOne({email: email}, function(err, user) {
        if(!e(err, res, 'Error finding invited user')) {
            if(!user) {
                User.create({ email: email, password: hash.gen(5) }, function (err, user) {
                    if (!e(err, res, 'Error creating invited user')) {
                        addUserToGroup(res, group, user);
                    }
                });
            } else {
                addUserToGroup(res, group, user);
            }
        }
    });
};

exports.uploadThumbnail = function(req, res) {
    //TODO: Real validation
    if(!req.files || !req.files.thumbnail) {
        res.status(500).send('Missing thumbnail file');
        return;
    }

    var thumbnail = req.files.thumbnail;

    var format = thumbnail.headers['content-type'];

    if(format.indexOf('image') == -1) {
        res.status(500).send('Only images allowed');
        return;
    }

    if(thumbnail.size > 1000 * 1000) {
        res.status(500).send('File too big: ' + thumbnail.size);
        return;
    }

    image.thumbnail(thumbnail.path, { size: 100, remove: true }, function(err, buffer) {
        if(err) {
            if(err.code === -1) {
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

            Group.findOneAndUpdate({_id: req.group.id}, { image: image }).populate('members.user', userFields).exec(function (err, group) {
                e(err, res, 'Error uploading thumbnail') || res.send(group);
            });
        }
    });
};

exports.addComment = function (req, res){
	var group = req.group;

	Group.findOneAndUpdate({ _id: group.id }, {
		$addToSet: {
			comments: {
				text: req.body.text,
				author: req.body.author,
				hashedEmail: req.body.hashedEmail,
				userRefId: req.body.userRefId
			}
		}
	}).populate('members.user', userFields).exec(
		function (err, group) {
			if (!e(err, res, 'Error adding comment')) {
				res.send(group);
			}
		}
	);
};

exports.deleteComment = function(req, res) {
	var group = req.group;
	Group.findOneAndUpdate({ _id: group.id }, { '$pull': { comments: { _id: req.params.commentId } } }).populate('members.user', userFields).exec(
		function (err, group) {
			if(!e(err, res, 'Error removing comment from group')) {
				res.send(group);
			}
		}
	);
};

// param parsing
var fromParam = function (req, res, next, q) {
    var query = Group.findOne(q);
    if(req.user) {
        query.or([{'members.user': req.user }, { 'public': true }]);
    } else {
        query.where('public', true);
    }

    query.populate('members.user', userFields).exec(function (err, group) {
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
    fromParam(req, res, next, { key: key });
};

exports.fromId = function (req, res, next, id) {
    fromParam(req, res, next, { _id: id });
};