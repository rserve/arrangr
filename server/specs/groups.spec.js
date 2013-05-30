/*global describe, it, expect, beforeEach, afterEach, runs, waitsFor */
// Set different port for testing
process.env.PORT = 8000;
process.env.DB_NAME = 'rserve_test';

var request = require('request');
var server = require('../server');
var groups = require('../api/groups.js');

var testData = [
    {
        name: "innebandy!",
        count: 2
    },
    {
        name: "ostprovning",
        count: 200
    },
    {
        name: "coding jam",
        count: 1337
    },
    {
        name: "spelkväll",
        count: 66
    }
];

describe('Groups', function () {
    var testGroups = null;
    beforeEach(function () {
        var done = false;

        runs(function(){
            groups.model.create(testData, function (err) {
                if (err) {
                    console.log(err);
                }
                testGroups = Array.prototype.slice.call(arguments, 1);
                done = true;
            });
        });

        waitsFor(function(){
            return done;
        });
    });

    afterEach(function () {
        var done = false;

        runs(function(){
            groups.model.remove({}, function (err) {
                if (err) {
                    console.log(err);
                }
                done = true;
            });
        });

        waitsFor(function(){
            return done;
        });
    });

    describe('findAll', function () {
        it('should return all groups', function (done) {
            request('http://localhost:' + process.env.PORT + '/api/groups', function (error, response, body) {
                expect(error).toBeFalsy();
                var actualGroups = JSON.parse(body);
                expect(actualGroups.length).toEqual(testGroups.length);
                done();
            });
        });
    });

    describe('findById', function () {
        it('should return correct group', function (done) {
            var testGroup = testGroups[0];
            request('http://localhost:' + process.env.PORT + '/api/groups/' + testGroup._id, function (error, response, body) {
                expect(error).toBeFalsy();
                var actualGroup = JSON.parse(body);
                expect(actualGroup._id).toBe(testGroup._id.toString());
                done();
            });
        });
    });
});