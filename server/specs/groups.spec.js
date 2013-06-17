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

describe('groups', function () {
    var testUser = null;
    var testGroups = null;
    var groupsEndpoint = baseEndpoint + 'groups';

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

    describe('unauthorized', function () {
        describe('get', function () {
            it('should return unauthorized', function (done) {
                request(groupsEndpoint, function (err, resp) {
                    expect(err).toBeFalsy();
                    expect(resp.statusCode).toEqual(401);
                    done();
                });
            });
        });
    });

    describe('authorized', function () {

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
    });

    /*describe('get /groups/:key', function () {
     it('should return correct group', function (done) {
     var testGroup = testGroups[0];
     request(baseEndpoint + 'groups/' + testGroup.key, function (err, resp, body) {
     expect(err).toBeFalsy();
     expect(resp.statusCode).toEqual(200);
     var actualGroup = JSON.parse(body);
     expect(actualGroup.key).toBe(testGroup.key);
     done();
     });
     });
     it('should return 404 when not found', function (done) {
     var nonExistingKey = 'idonotexist';
     request(baseEndpoint + 'groups/' + nonExistingKey, function (err, resp, body) {
     expect(err).toBeFalsy();
     expect(resp.statusCode).toEqual(404);
     done();
     });
     });
     });

     describe('post /groups', function() {
     it('should create group', function(done) {
     var testGroup = testData[0];
     request.post(baseEndpoint + 'groups', {form: testGroup}, function(err, resp, body) {
     expect(err).toBeFalsy();
     expect(resp.statusCode).toEqual(200);
     Group.find(function(err, groups){
     expect(err).toBeFalsy();
     expect(groups.length).toEqual(testData.length+1);
     done();
     });
     });
     });
     });

     describe('put /groups/:key', function() {
     it('should update name', function(done) {
     var testGroup = testGroups[0];
     var expectedName = 'new name';
     request.put(baseEndpoint + 'groups/' + testGroup.key, {form: {name: expectedName }}, function(err, resp, body) {
     expect(err).toBeFalsy();
     expect(resp.statusCode).toEqual(200);
     Group.findOne({_id:testGroup.id}, function(err, group){
     expect(err).toBeFalsy();
     expect(group.name).toEqual(expectedName);
     done();
     });
     });
     });
     });

     describe('delete /groups/:key', function() {
     it('should remove group', function(done) {
     var testGroup = testGroups[0];
     request.del(baseEndpoint + 'groups/' + testGroup.key, function(err, resp, body) {
     expect(err).toBeFalsy();
     expect(resp.statusCode).toEqual(200);
     Group.find(function(err, groups){
     expect(err).toBeFalsy();
     expect(groups.length).toEqual(testData.length-1);
     done();
     });
     });
     });
     });*/
});