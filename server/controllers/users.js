/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var e = require('../helpers/errorhandler');
var User = mongoose.model('User');
var hash = require('../helpers/hash.js');
var mailer = require('../helpers/mailer.js');

exports.login = function (req, res, next, passport) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (info) {
            return res.status(400).send({error: 'Authorization failed', message: info.message });
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }
            return res.send(user);
        });
    })(req, res, next);
};

exports.logout = function (req, res) {
    req.logout();
    res.send();
};

exports.session = function (req, res) {
    res.send(req.user);
};

exports.create = function (req, res) {
    var user = new User(req.body);
    user.provider = 'local';
    if (!user.password) {
        user.password = hash.gen(5);
    }
    user.save(function (err) {
        if (!e(err, res, 'Error creating user')) {
            mailer.sendRegistrationMail(user);
            req.logIn(user, function (err) {
                e(err, res, 'Error when logging in') || res.send(user);
            });
        }
    });
};

exports.findById = function (req, res) {
    res.send(req.profile);
};

exports.verify = function (req, res) {
    var hash = req.params.hash;
    User.findOneAndUpdate({verificationHash: hash}, { $set: { verifiedAt: new Date() }, $unset: { verificationHash: 1 } }, function (err, user) {
        if (!e(err, res, 'Error verifying user')) {
            if (!user) {
                res.status(404).send({error: 'User not found'});
            } else {
                res.send(user);
            }
        }
    });
};

// param parsing
var fromParam = function (req, res, next, q) {
    User.findOne(q, function (err, user) {
        if (!e(err, res, 'Error finding user')) {
            if (!user) {
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