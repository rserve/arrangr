/*global describe, it, expect, before, beforeEach, afterEach, runs, waitsFor */
// Set different port for testing
process.env.PORT = 8000;
process.env.NODE_ENV = 'test';

var request = require('request').defaults({json: true});
var server = require('../server');
var mongoose = require('mongoose');
var Group = mongoose.model('Group');

var testData = [
    { name: "innebandy!" },
    { name: "ostprovning" },
    { name: "coding jam" },
    { name: "spelkväll" }
];

var testEndpoint = 'http://localhost:' + process.env.PORT + '/api/';

describe('api', function () {
    var testGroups = null;

    beforeEach(function () {
        var done = false;

        runs(function(){
            Group.remove({}, function(err) {
                if (err) {
                    console.log(err);
                }
                Group.create(testData, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    testGroups = Array.prototype.slice.call(arguments, 1);
                    done = true;
                });
            });
        });

        waitsFor(function(){
            return done;
        });
    });

    describe('get /groups', function () {
        it('should return unauthorized', function (done) {
            request(testEndpoint + 'groups', function (err, resp) {
                expect(err).toBeFalsy();
                expect(resp.statusCode).toEqual(401);
                done();
            });
        });
    });

    /*describe('get /groups/:key', function () {
        it('should return correct group', function (done) {
            var testGroup = testGroups[0];
            request(testEndpoint + 'groups/' + testGroup.key, function (err, resp, body) {
                expect(err).toBeFalsy();
                expect(resp.statusCode).toEqual(200);
                var actualGroup = JSON.parse(body);
                expect(actualGroup.key).toBe(testGroup.key);
                done();
            });
        });
        it('should return 404 when not found', function (done) {
            var nonExistingKey = 'idonotexist';
            request(testEndpoint + 'groups/' + nonExistingKey, function (err, resp, body) {
                expect(err).toBeFalsy();
                expect(resp.statusCode).toEqual(404);
                done();
            });
        });
    });

    describe('post /groups', function() {
        it('should create group', function(done) {
            var testGroup = testData[0];
            request.post(testEndpoint + 'groups', {form: testGroup}, function(err, resp, body) {
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
            request.put(testEndpoint + 'groups/' + testGroup.key, {form: {name: expectedName }}, function(err, resp, body) {
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
            request.del(testEndpoint + 'groups/' + testGroup.key, function(err, resp, body) {
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