var mongoose = require('mongoose');
var Group = mongoose.model('Group');

exports.findAll = function(req, res) {
    Group.find(function(err, groups){
        if(err){
            console.log('Error finding groups: ' + err);
            res.send({'error': err});
        }else{
            res.send(groups);
        }
    });
};

exports.findById = function(req, res) {
    var id = req.params.id;
    Group.findOne({_id:id}, function(err, group){
        if(err){
            console.log('Error finding group: ' + err);
            res.send({'error': err});
        }else{
            res.send(group);
        }
    });
};

exports.findByKey = function(req, res) {
    var key = req.params.key;
    Group.findOne({key:key}, function(err, group){
        if(err){
            console.log('Error finding group: ' + err);
            res.status(500).send({'error': err});
        }else{
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
    group.count = 0;
    Group.create(group, function(err, group) {
        if (err) {
            console.log('Error creating group: ' + err);
            res.send({'error': err});
        } else {
            res.send(group);
        }
    });
};

exports.update = function(req, res) {
    var key = req.params.key;
    var group = req.body;
    Group.update({key:key}, group, function(err) {
        if (err) {
            console.log('Error updating group: ' + err);
            res.send({'error': err});
        }
        res.send(group);
    });
};

exports.delete = function(req, res) {
    var key = req.params.key;
    Group.remove({key:key}, function(err) {
        if (err) {
            console.log('Error deleting group: ' + err);
            res.send({'error': err});
        }
        res.send();
    });
};