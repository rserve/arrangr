var mongoose = require('mongoose');
var e = require('./errorhandler');
var Group = mongoose.model('Group');

exports.findAll = function(req, res) {
    Group.find(function(err, groups){
        e(err, res, 'Error finding groups') || res.send(groups);
    });
};

exports.findByUser = function(req, res) {
    var user = req.user;
    Group.find({'members.user': user}, function(err, groups) {
        e(err, res, 'Error finding groups by user') || res.send(groups);
    });
};

exports.findById = function(req, res) {
    var id = req.params.id;
    Group.findOne({_id:id}, function(err, group){
        e(err, res, 'Error finding group by id') || res.send(group);
    });
};

exports.findByKey = function(req, res) {
    var key = req.params.key;
    Group.findOne({key:key}, function(err, group){
        if(!e(err, res, 'Error finding group by key')) {
            if(!group) {
                res.status(404).send({error: 'Group not found'});
            } else {
                res.send(group);
            }
        }
    });
};

exports.create = function(req, res) {
    var group = req.body;
    group.members = [ { user: req.user, admin: true, status: 'Yes' } ];
    Group.create(group, function(err, group) {
        e(err, res, 'Error creating group') || res.send(group);
    });
};

exports.update = function(req, res) {
    var key = req.params.key;
    var group = req.body;
    Group.update({key:key}, group, function(err) {
        e(err, res, 'Error updating group') || res.send(group);
    });
};

exports.delete = function(req, res) {
    var key = req.params.key;
    Group.remove({key:key}, function(err) {
        e(err, res, 'Error removing group') || res.send();
    });
};