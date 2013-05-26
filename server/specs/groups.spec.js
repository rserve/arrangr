/*global describe, it, expect */
// Set different port for testing
process.env.port = 8000;

var request = require('request');
var server = require('../server');
var groups = require('../api/groups.js');

describe('Groups', function () {
     describe('findAll', function () {
        it('should return all groups', function (done) {
            request('http://localhost:'+process.env.port+'/groups', function(error, response, body){
                expect(error).toBeFalsy();
                var list = JSON.parse(body);
                expect(list.length).toEqual(groups.data.length);
                done();
            });
        });
    });

    describe('findById', function() {
        it('should return correct group', function (done) {
            var expectedGroup = groups.data[0];
            request('http://localhost:'+process.env.port+'/groups/'+expectedGroup.id, function(error, response, body){
                expect(error).toBeFalsy();
                var actualGroup = JSON.parse(body);
                expect(actualGroup.id).toEqual(expectedGroup.id);
                done();
            });
        });
    });
});