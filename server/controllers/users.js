/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var e = require('../helpers/errorhandler');
var User = mongoose.model('User');
var hash = require('../helpers/hash.js');
var mailer = require('../helpers/mailer.js');
var image = require('../helpers/image');

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
	var user = req.body;
	user.provider = 'local';
	User.create(user, function (err, user) {
		if (!e(err, res, 'Error creating user')) {
			mailer.sendRegistrationMail(user);
			res.send(user);
		}
	});
};

exports.update = function (req, res) {
	var user = req.body;
	User.findOneAndUpdate({_id: req.profile.id}, user, function (err, user) {
		if (e(err, res, 'Error updating user')) return;
		if (req.body.password) {
			req.profile.password = req.body.password;
			req.profile.save(function (err) {
				e(err, res, 'Error updating user') || res.send(user);
			});
		} else {
			res.send(user);
		}
	});
};

exports.findById = function (req, res) {
	res.send(req.profile);
};

exports.password = function (req, res) {
	var hash = req.body.hash;

	User.findOne({verificationHash: hash}, function (err, user) {
		if(!e(err, res, 'Error settings password')) {
			if (!user) {
				res.status(404).send({error: 'Invalid hash'});
			} else {
				user.password = req.body.password;
				user.verifiedAt = new Date();
				user.verificationHash = undefined;
				user.save(function (err) {
					if(!e(err, res, 'Error updating password')) {
						req.logIn(user, function (err) {
							e(err, res, 'Error when logging in') || res.send(user);
						});
					}
				});
			}
		}
	});
};

exports.uploadThumbnail = function (req, res) {
	//TODO: Real validation
	if (!req.files || !req.files.thumbnail) {
		res.status(500).send('Missing thumbnail file');
		return;
	}

	var thumbnail = req.files.thumbnail;

	var format = thumbnail.headers['content-type'];

	if (format.indexOf('image') == -1) {
		res.status(500).send('Only images allowed');
		return;
	}

	if (thumbnail.size > 1000 * 1000) {
		res.status(500).send('File too big: ' + thumbnail.size);
		return;
	}

	image.thumbnail(thumbnail.path, { size: 100, remove: true }, function (err, buffer) {
		if (err) {
			if (err.code === -1) {
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

			User.findOneAndUpdate({_id: req.profile.id}, { image: image }).exec(function (err, user) {
				e(err, res, 'Error uploading thumbnail') || res.send(user);
			});
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