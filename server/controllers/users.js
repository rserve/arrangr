
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
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
    if(req.profile) {
        res.send(req.profile);
    } else {
        res.status(500).send();
    }
};

exports.user = function (req, res, next, id) {
    User.findOne({ _id : id }, function (err, user) {
        if (err) return next(err);
        if (!user) return next(new Error('Failed to load User ' + id));
        req.profile = user;
        next();
    });
};