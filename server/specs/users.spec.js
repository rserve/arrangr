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

        describe('get /login', function () {
            it('should login user', function (done) {
                var testUser = testData.users[0];
                request.post(usersEndpoint + '/login', { form: testUser }, function (err, resp, user) {
                    expect(err).toBeFalsy();
                    expect(resp.statusCode).toEqual(200);
                    expect(user.email).toEqual(testUser.email);
                    request(usersEndpoint + '/session', function (err, resp, user) {
                        expect(err).toBeFalsy();
                        expect(resp.statusCode).toEqual(200);
                        done();
                    });
                });
            });

            it('should not allow wrong password', function (done) {
                request.post(usersEndpoint + '/login', { form: { email: 'test@test.com', password: 'wrong' }}, function (err, resp, body) {
                    expect(err).toBeFalsy();
                    expect(resp.statusCode).toEqual(400);
                    expect(body.error).toEqual('Authorization failed');
                    expect(body.message).toEqual('Invalid password');
                    done();
                });
            });

            it('should not allow non existing email', function (done) {
                request.post(usersEndpoint + '/login', { form: { email: 'test3@test.com', password: 'password' }}, function (err, resp, body) {
                    expect(err).toBeFalsy();
                    expect(resp.statusCode).toEqual(400);
                    expect(body.error).toEqual('Authorization failed');
                    expect(body.message).toEqual('Unknown user');
                    done();
                });
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

            it('should generate password if empty', function (done) {
                request.post(usersEndpoint, { form: { email: 'test3@email.com', password: '' } }, function (err, resp, user) {
                    expect(err).toBeFalsy();
                    expect(resp.statusCode).toEqual(200);
                    expect(user.id).toBeDefined();
                    done();
                });
            });
        });

        describe('get /verify/:hash', function() {
            it('should verify user', function(done) {
                var testUser = testUsers[0];
                request.get(usersEndpoint + '/verify/' + testUser.verificationHash, function(err, resp, user) {
                    expect(err).toBeFalsy();
                    expect(resp.statusCode).toEqual(200);
                    expect(user.verifiedAt).toBeDefined();
                    done();
                });
            });

            it('should return 404 when not found', function(done) {
                request.get(usersEndpoint + '/verify/nonexistinghash', function(err, resp) {
                    expect(err).toBeFalsy();
                    expect(resp.statusCode).toEqual(404);
                    done();
                });
            });
        });
    });

    describe('authenticated', function () {
        var authenticatedUser = null;

        beforeEach(function () {
            var done = false;

            runs(function () {
                helper.login(testUsers[0].email, testUsers[0].password, function (user) {
                    authenticatedUser = user;
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
                request(usersEndpoint + '/' + testUser.id, function (err, resp, user) {
                    expect(err).toBeFalsy();
                    expect(resp.statusCode).toEqual(200);
                    expect(user.email).toEqual(testUser.email);
                    done();
                });
            });
        });

        describe('put /:userId', function () {
            it('should update name', function (done) {
                var testUser = authenticatedUser;
                var expectedName = 'new name';
                request.put(usersEndpoint + '/' + testUser.id, {form: {name: expectedName }}, function (err, resp, user) {
                    expect(err).toBeFalsy();
                    expect(resp.statusCode).toEqual(200);
                    expect(user.name).toEqual(expectedName);
                    done();
                });
            });
            it('should not be able to update someone else', function(done) {
                var testUser = testUsers[1];
                request.put(usersEndpoint + '/' + testUser.id, {form: {name: 'new name' }}, function (err, resp) {
                    expect(err).toBeFalsy();
                    expect(resp.statusCode).toEqual(403);
                    done();
                });
            });
        });
    });
});
