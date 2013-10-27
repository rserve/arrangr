/*global describe, it, expect, before, beforeEach, afterEach, runs, waitsFor */
var helper = require('./spechelper');
var request = helper.request;
var moment = require('moment');
var Group = helper.mongoose.model('Group');
var User = helper.mongoose.model('User');

var testData = {
    user: { email: 'test@test.com', password: 'password' },
    groups: [
        { name: "innebandy!" },
        { name: "ostprovning" },
        { name: "coding jam", public: true },
        { name: "spelkväll" }
    ]
};

var groupsEndpoint = helper.endpoint('groups');

describe(groupsEndpoint, function () {
    var testUser = null;
    var testGroups = null;

    var getPublicGroup = function() {
        for(var i in testGroups) {
            if(testGroups[i].public) {
                return testGroups[i];
            }
        }
    };

    var getPrivateGroup = function() {
        for(var i in testGroups) {
            if(!testGroups[i].public) {
                return testGroups[i];
            }
        }
    };

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
        describe('get', function () {
            helper.testUnauthorized(function(cb) {
                request(groupsEndpoint, cb);
            });
        });

        describe('get /:key', function () {
            it('should return 404 if private', function(done) {
                var testGroup = getPrivateGroup();
                request(groupsEndpoint + '/' + testGroup.key, function (err, resp, actualGroup) {
                    expect(err).toBeFalsy();
                    expect(resp.statusCode).toEqual(404);
                    done();
                });
            });

            it('should return group if public', function(done) {
                var testGroup = getPublicGroup();
                request(groupsEndpoint + '/' + testGroup.key, function (err, resp, actualGroup) {
                    expect(err).toBeFalsy();
                    expect(resp.statusCode).toEqual(200);
                    expect(actualGroup).toBeDefined();
                    expect(actualGroup.key).toBe(testGroup.key);
                    expect(actualGroup.public).toBeTruthy();
                    done();
                });
            });
        });

        describe('post', function() {
            helper.testUnauthorized(function(cb) {
               request.post(groupsEndpoint, cb);
           });
        });

        describe('put /:key', function() {
            helper.testUnauthorized(function(cb) {
                var testGroup = getPublicGroup();
                request.put(groupsEndpoint + '/' + testGroup.key, cb);
            });
        });

        describe('delete /:key', function() {
            helper.testUnauthorized(function(cb) {
                var testGroup = getPublicGroup();
                request.del(groupsEndpoint + '/' + testGroup.key, cb);
            });
        });
    });

    describe('authenticated', function () {
        var authenticatedUser = testData.user;

        beforeEach(function () {
            var done = 0;

            runs(function () {
                User.remove({}, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    User.create(authenticatedUser, function (err, user) {
                        if (err) {
                            console.log(err);
                        }
                        testUser = user;
                        testGroups[0].update({ $addToSet: { members: { user: user, admin: true } } }, function (err) {
                            if (err) {
                                console.log(err);
                            }
                            done++;
                        });
                        testGroups[1].update({ $addToSet: { members: { user: user, admin: false } } }, function (err) {
                            if (err) {
                                console.log(err);
                            }
                            done++;
                        });
                        helper.login(authenticatedUser.email, authenticatedUser.password, function () {
                            done++;
                        });
                    });
                });
            });

            waitsFor(function () {
                return done == 3;
            });
        });

        describe('get', function () {
            it('should return users and public groups', function (done) {
                request(groupsEndpoint, function (err, resp, actualGroups) {
                    expect(err).toBeFalsy();
                    expect(resp.statusCode).toEqual(200);
                    expect(actualGroups.length).toEqual(3);
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
            it('should return 404 when not member of private group', function (done) {
                var testGroup = testGroups[3];
                request(groupsEndpoint + '/' + testGroup.key, function (err, resp) {
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

            it('should not be able to remove if not admin', function(done) {
                var testGroup = testGroups[1];
                request.del(groupsEndpoint + '/' + testGroup.key, function(err, resp) {
                    expect(err).toBeFalsy();
                    expect(resp.statusCode).toEqual(403);
                    done();
                });
            });
        });

		describe('post /:key/increment', function() {
			it('should increment group to the next cycle', function(done) {
				var testGroup = testGroups[0];
				request.post(groupsEndpoint + '/' + testGroup.key + '/increment', function(err, resp, group) {
					expect(err).toBeFalsy();
					expect(resp.statusCode).toEqual(200);
					expect(new Date(group.startDate)).toEqual(moment(testGroup.startDate).add('days', 7).toDate());
					expect(group.comments.length).toBe(0);
					done();
				});
			});

			it('should not be able to increment if not admin', function(done) {
				var testGroup = testGroups[1];
				request.post(groupsEndpoint + '/' + testGroup.key + '/increment', function(err, resp) {
					expect(err).toBeFalsy();
					expect(resp.statusCode).toEqual(403);
					done();
				});
			});
		});
    });
});