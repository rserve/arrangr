/*global describe, it, expect, before, beforeEach, afterEach, runs, waitsFor */
process.env.NODE_ENV = 'test';

var request = exports.request = require('request').defaults({json: true, jar: true});
var server = exports.server = require('../server');
var mongoose = exports.mongoose = require('mongoose');
var config = require('../config/config')['test'];

var baseEndpoint = exports.baseEndpoint = 'http://localhost:' + config.port + '/api/';

exports.endpoint = function (path) {
    return baseEndpoint + path;
};

exports.login = function (email, password, cb) {
    request.post(baseEndpoint + 'users/login', {
        form: {
            email: email,
            password: password
        }
    }, function (err, res, user) {
        cb(user);
    });
};

exports.testUnauthorized = function (cb) {
    it('should return unauthorized', function (done) {
        cb(function (err, resp) {
            expect(err).toBeFalsy();
            expect(resp.statusCode).toEqual(401);
            done();
        });
    });
};

// Mock mailer so we dont send real mails in test
/* jshint camelcase: false */
var mailer = require('../helpers/mailer.js');

mailer.send = function (options) {
    expect(options.message).toBeDefined();
};
mailer.sendRegistrationMail = function (user) {
    expect(user).toBeDefined();
    expect(user.email).toBeDefined();
    expect(user.verificationHash).toBeDefined();
};

mailer.sendInvitationMail = function (user, group, groupCreator) {
	expect(user).toBeDefined();
	expect(group).toBeDefined();
	expect(groupCreator).toBeDefined();
};

mailer.sendLostPasswordMail = function(user) {
	expect(user).toBeDefined();
	expect(user.email).toBeDefined();
	expect(user.verificationHash).toBeDefined();
};