/*global describe, it, expect, before, beforeEach, afterEach, runs, waitsFor */
// Set different port for testing
process.env.PORT = 8000;
process.env.NODE_ENV = 'test';

var request = require('request').defaults({json: true});
var server = require('../server');
var mongoose = require('mongoose');
var Group = mongoose.model('Group');
var User = mongoose.model('User');

var testData = {
    user: { email: 'test@test.com', password: 'password' },
    groups: [
        { name: "innebandy!" },
        { name: "ostprovning" },
        { name: "coding jam" },
        { name: "spelkväll" }
    ]
};

var baseEndpoint = 'http://localhost:' + process.env.PORT + '/api/';
var groupsEndpoint = baseEndpoint + 'groups';

describe(groupsEndpoint, function () {
    var testUser = null;
    var testGroups = null;

    beforeEach(function () {
        var done = false;

        runs(function () {
            Group.remove({}, function (err) {
                if (err) {
                    console.log(err);
                }
                Group.create(testData.groups, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    testGroups = Array.prototype.slice.call(arguments, 1);
                    done = true;
                });
            });
        });

        waitsFor(function () {
            return done;
        });
    });

    describe('not authenticated', function () {
        function testUnauthorized(cb) {
            it('should return unauthorized', function (done) {
                cb(function (err, resp) {
                    expect(err).toBeFalsy();
                    expect(resp.statusCode).toEqual(401);
                    done();
                });
            });
        }

        describe('get', function () {
            testUnauthorized(function(cb) {
                request(groupsEndpoint, cb);
            });
        });

        describe('get /:key', function () {
            testUnauthorized(function(cb) {
                var testGroup = testGroups[0];
                request(groupsEndpoint + '/' + testGroup.key, cb);
            });
        });

        describe('post', function() {
           testUnauthorized(function(cb) {
               request.post(groupsEndpoint, cb);
           });
        });

        describe('put /:key', function() {
            testUnauthorized(function(cb) {
                var testGroup = testGroups[0];
                request.put(groupsEndpoint + '/' + testGroup.key, cb);
            });
        });

        describe('delete /:key', function() {
            testUnauthorized(function(cb) {
                var testGroup = testGroups[0];
                request.del(groupsEndpoint + '/' + testGroup.key, cb);
            });
        });
    });

    describe('authenticated', function () {

        beforeEach(function () {
            var done = false;

            runs(function () {
                User.remove({}, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    User.create(testData.user, function (err, user) {
                        if (err) {
                            console.log(err);
                        }
                        testUser = user;
                        testGroups[0].update({ $addToSet: { members: { user: user } } }, function (err) {
                            if (err) {
                                console.log(err);
                            }
                            request.post(baseEndpoint + 'users/login', {
                                form: {
                                    email: testData.user.email,
                                    password: testData.user.password
                                }
                            }, function (err, resp) {
                                    done = true;
                            });
                        });
                    });
                });
            });

            waitsFor(function () {
                return done;
            });
        });

        describe('get', function () {
            it('should return users groups', function (done) {
                request(groupsEndpoint, function (err, resp, actualGroups) {
                    expect(err).toBeFalsy();
                    expect(resp.statusCode).toEqual(200);
                    expect(actualGroups.length).toEqual(1);
                    expect(actualGroups[0].key).toEqual(testGroups[0].key);
                    done();
                });
            });
        });

        describe('get /:key', function () {
            it('should return correct group', function (done) {
                var testGroup = testGroups[0];
                request(groupsEndpoint + '/' + testGroup.key, function (err, resp, actualGroup) {
                    expect(err).toBeFalsy();
                    expect(resp.statusCode).toEqual(200);
                    expect(actualGroup.key).toBe(testGroup.key);
                    done();
                });
            });
            it('should return 404 when not found', function (done) {
                var nonExistingKey = 'idonotexist';
                request(groupsEndpoint + '/' + nonExistingKey, function (err, resp) {
                    expect(err).toBeFalsy();
                    expect(resp.statusCode).toEqual(404);
                    done();
                });
            });
        });

        describe('post', function() {
            it('should create group', function(done) {
                var testGroup = testData.groups[0];
                request.post(groupsEndpoint, {form: testGroup}, function(err, resp) {
                    expect(err).toBeFalsy();
                    expect(resp.statusCode).toEqual(200);
                    Group.find(function(err, groups){
                        expect(err).toBeFalsy();
                        expect(groups.length).toEqual(testData.groups.length+1);
                        done();
                    });
                });
            });
        });

        describe('put /:key', function() {
            it('should update name', function(done) {
                var testGroup = testGroups[0];
                var expectedName = 'new name';
                request.put(groupsEndpoint + '/' + testGroup.key, {form: {name: expectedName }}, function(err, resp, responseGroup) {
                    expect(err).toBeFalsy();
                    expect(resp.statusCode).toEqual(200);
                    expect(responseGroup.name).toEqual(expectedName);
                    Group.findOne({_id:testGroup.id}, function(err, group){
                        expect(err).toBeFalsy();
                        expect(group.name).toEqual(expectedName);
                        done();
                    });
                });
            });
        });

        describe('delete /:key', function() {
            it('should remove group', function(done) {
                var testGroup = testGroups[0];
                request.del(groupsEndpoint + '/' + testGroup.key, function(err, resp) {
                    expect(err).toBeFalsy();
                    expect(resp.statusCode).toEqual(200);
                    Group.find(function(err, groups){
                        expect(err).toBeFalsy();
                        expect(groups.length).toEqual(testData.groups.length-1);
                        done();
                    });
                });
            });
        });
    });
});