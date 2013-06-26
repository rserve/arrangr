/*global describe, it, expect, before, beforeEach, afterEach, runs, waitsFor */
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
            helper.testUnauthorized(function (cb) {
                request(usersEndpoint + '/logout', cb);
            });
        });

        describe('get /session', function () {
            helper.testUnauthorized(function (cb) {
                request(usersEndpoint + '/session', cb);
            });
        });

        describe('get /:userId', function () {
            helper.testUnauthorized(function (cb) {
                request(usersEndpoint + '/' + testUsers[0].id, cb);
            });
        });

        describe('post', function () {
            var testUser = { email: 'test3@email.com', password: 'password' };
            it('should create user', function (done) {
                request.post(usersEndpoint, { form: testUser }, function (err, resp, responseUser) {
                    expect(err).toBeFalsy();
                    expect(resp.statusCode).toEqual(200);
                    expect(responseUser.email).toEqual(testUser.email);
                    User.find(function (err, users) {
                        expect(err).toBeFalsy();
                        expect(users.length).toEqual(testData.users.length + 1);
                        done();
                    });
                });
            });

            it('should not allow existing email', function (done) {
                request.post(usersEndpoint, { form: testData.users[0] }, function (err, resp) {
                    expect(err).toBeFalsy();
                    expect(resp.statusCode).toEqual(400);
                    done();
                });
            });

            it('should not allow empty email', function (done) {
                request.post(usersEndpoint, { form: { email: '', password: 'password' } }, function (err, resp) {
                    expect(err).toBeFalsy();
                    expect(resp.statusCode).toEqual(400);
                    done();
                });
            });

            it('should not allow invalid email', function (done) {
                request.post(usersEndpoint, { form: { email: 'test', password: 'password' } }, function (err, resp) {
                    expect(err).toBeFalsy();
                    expect(resp.statusCode).toEqual(400);
                    done();
                });
            });

            it('should not allow empty password', function (done) {
                request.post(usersEndpoint, { form: { email: 'test3@email.com', password: '' } }, function (err, resp) {
                    expect(err).toBeFalsy();
                    expect(resp.statusCode).toEqual(400);
                    done();
                });
            });
        });
    });

    describe('authenticated', function () {
        var authenticatedUser = testData.users[0];

        beforeEach(function () {
            var done = false;

            runs(function () {
                helper.login(authenticatedUser.email, authenticatedUser.password, function () {
                    done = true;
                });
            });

            waitsFor(function () {
                return done;
            });
        });

        describe('get /logout', function () {
            it('should logout the user', function (done) {
                request(usersEndpoint + '/logout', function (err, resp) {
                    expect(err).toBeFalsy();
                    expect(resp.statusCode).toEqual(200);
                    request(usersEndpoint + '/session', function (err, resp) {
                        expect(err).toBeFalsy();
                        expect(resp.statusCode).toEqual(401);
                        done();
                    });
                });
            });
        });

        describe('get /session', function () {
            it('should return logged in user', function (done) {
                request(usersEndpoint + '/session', function (err, resp, user) {
                    expect(err).toBeFalsy();
                    expect(resp.statusCode).toEqual(200);
                    expect(user.email).toEqual(authenticatedUser.email);
                    done();
                });
            });
        });

        describe('get /:userId', function () {
            it('should return correct user', function (done) {
                var testUser = testUsers[1];
                request(usersEndpoint + '/' + testUser.id, function(err, resp, user) {
                    expect(err).toBeFalsy();
                    expect(resp.statusCode).toEqual(200);
                    expect(user.email).toEqual(testUser.email);
                    done();
                });
            });
        });
    });
});
