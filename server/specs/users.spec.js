/*global describe, it, expect, before, beforeEach, afterEach, runs, waitsFor */
// Set different port for testing
process.env.PORT = 8000;
process.env.NODE_ENV = 'test';

var helper = require('./spechelper');
var request = helper.request;
var User = helper.mongoose.model('User');

var testData = {
    users: [
        { email: 'test@test.com', password: 'password' },
        { email: 'test2@test.com', password: 'password' }
    ]
};

var usersEndpoint = helper.endpoint('users');

describe(usersEndpoint, function () {
    var testUsers = null;

    beforeEach(function () {
        var done = false;

        runs(function () {
            User.remove({}, function (err) {
                if (err) {
                    console.log(err);
                }
                User.create(testData.users, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    testUsers = Array.prototype.slice.call(arguments, 1);
                    done = true;
                });
            });
        });

        waitsFor(function () {
            return done;
        });
    });

    describe('not authenticated', function () {

        describe('get /logout', function () {
            helper.testUnauthorized(function(cb) {
                request(usersEndpoint + '/logout', cb);
            });
        });

        describe('get /session', function () {
            helper.testUnauthorized(function(cb) {
                request(usersEndpoint + '/session', cb);
            });
        });

        describe('get /:userId', function () {
            helper.testUnauthorized(function(cb) {
                request(usersEndpoint + '/' + testUsers[0].id, cb);
            });
        });
    });

    describe('authenticated', function () {

        beforeEach(function () {
            var done = false;

            runs(function () {
                helper.login(testData.users[0].email, testData.users[0].password, function () {
                    done = true;
                });
            });

            waitsFor(function () {
                return done;
            });
        });

        describe('get /logout', function() {
           it('should logout the user', function(done) {
                request(usersEndpoint + '/logout', function(err, resp) {
                    expect(err).toBeFalsy();
                    expect(resp.statusCode).toEqual(200);
                    request(usersEndpoint + '/session', function(err, resp) {
                        expect(err).toBeFalsy();
                        expect(resp.statusCode).toEqual(401);
                        done();
                    });
                });
            });
        });
    });
});
