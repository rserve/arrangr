var Group = require('../models/group.js');

exports.findAll = function(req, res) {
    Group.find(function(e, groups){
        if(e){
            console.log('Error finding groups: ' + e);
            res.send({'error':'An error has occurred'});
        }else{
            res.send(groups);
        }
    });
};

exports.findById = function(req, res) {
    var id = req.params.id;
    Group.findOne({_id:id}, function(e, group){
        if(e){
            console.log('Error finding group: ' + e);
            res.send({'error':'An error has occurred'});
        }else{
            res.send(group);
        }
    });
};

exports.create = function(req, res) {
    var group = req.body;
    group.count = 0;
    Group.create(group, function(err, group) {
        if (err) {
            console.log('Error creating group: ' + err);
            res.send({'error':'An error has occurred'});
        } else {
            res.send(group);
        }
    });
};

exports.update = function(req, res) {
    var id = req.params.id;
    var group = req.body;
    Group.update({_id: id}, group, function(err) {
        if (err) {
            console.log('Error updating group: ' + err);
            res.send({'error':'An error has occurred'});
        }
        res.send(group);
    });
};

exports.delete = function(req, res) {
    var id = req.params.id;
    Group.remove({_id: id}, function(err) {
        if (err) {
            console.log('Error deleting group: ' + err);
            res.send({'error':'An error has occurred - ' + err});
        }
    });
};