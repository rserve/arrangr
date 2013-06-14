
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
    , User = mongoose.model('User');

/**
 * Logout
 */

exports.logout = function (req, res) {
    req.logout();
    req.send();
};

/**
 * Session
 */

exports.session = function (req, res) {
    res.send();
};

/**
 * Create user
 */

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

/**
 *  Show profile
 */

exports.show = function (req, res) {
    var user = req.profile;
    res.render('users/show', {
        title: user.name,
        user: user
    })
};

/**
 * Find user by id
 */

exports.user = function (req, res, next, id) {
    User
        .findOne({ _id : id })
        .exec(function (err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + id));
            req.profile = user;
            next();
        })
};