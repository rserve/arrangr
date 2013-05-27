/*global describe, it, expect */
// Set different port for testing
process.env.PORT = 8000;
process.env.DB_NAME = 'rserve_test';

var request = require('request');
var server = require('../server');
var groups = require('../api/groups.js');

describe('Groups', function () {
    var id = false;
     describe('findAll', function () {
        it('should return all groups', function (done) {
            request('http://localhost:'+process.env.PORT+'/api/groups', function(error, response, body){
                expect(error).toBeFalsy();
                var list = JSON.parse(body);
                expect(list.length).toEqual(groups.data.length);
                id = list[0]._id;
                done();
            });
        });
    });

    describe('findById', function() {
        it('should return correct group', function (done) {
            expect(id).toBeTruthy();
            request('http://localhost:'+process.env.PORT+'/api/groups/'+id, function(error, response, body){
                expect(error).toBeFalsy();
                var actualGroup = JSON.parse(body);
                expect(actualGroup._id).toEqual(id);
                done();
            });
        });
    });
});