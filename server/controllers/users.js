
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.logout = function (req, res) {
    req.logout();
    res.send();
};

exports.create = function (req, res) {
    var user = new User(req.body);
    user.provider = 'local';
    user.save(function (err) {
        if (err) {
            res.status(500).send({'error': err});
        }
        req.logIn(user, function(err) {
            if (err) return next(err);
            res.send(user);
        })
    })
};

exports.findById = function (req, res) {
    var id = req.params.id;
    User.findOne({_id:id}, function(err, user){
        if(err){
            console.log('Error finding user: ' + err);
            res.send({'error': err});
        }else{
            res.send(user);
        }
    });
};