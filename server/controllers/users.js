
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
                e(err, res,'Error when logging in') || res.send(user);
            });
        }
    });
};

exports.findById = function (req, res) {
    res.send(req.profile);
};

// param parsing
var fromParam = function(req, res, next, q) {
    User.findOne(q, function (err, user) {
        if(!e(err, res, 'Error finding user')) {
            if(!user) {
                res.status(404).send({error: 'User not found'});
            } else {
                req.profile = user;
                next();
            }
        }
    });
};

exports.fromId = function (req, res, next, id) {
    fromParam(req, res, next, { _id: id });
};