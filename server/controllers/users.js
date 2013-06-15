
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var e = require('./errorhandler');
var User = mongoose.model('User');

exports.logout = function (req, res) {
    req.logout();
    res.send();
};

exports.session = function(req, res) {
    res.send(req.user);
};

exports.create = function (req, res) {
    var user = new User(req.body);
    user.provider = 'local';
    user.save(function (err) {
        if(!e(err, res, 'Error creating user')) {
            req.logIn(user, function(err) {
                if (err) return next(err);
                res.send(user);
            });
        }
    });
};

exports.findById = function (req, res) {
    if(req.profile) {
        res.send(req.profile);
    } else {
        res.status(500).send();
    }
};

exports.user = function (req, res, next, id) {
    User.findOne({ _id : id }, function (err, user) {
        if(!e(err, res, 'Error finding user by id')) {
            req.profile = user;
            next();
        }
    });
};