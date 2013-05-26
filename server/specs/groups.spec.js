var request = require('request');
var server = require('../server');
var groups = require('../api/groups.js');

describe('Groups', function () {
     describe('all', function () {
        it('should return all groups', function (done) {
            request('http://localhost:3000/groups', function(error, response, body){
                expect(error).toBeFalsy();
                var list = JSON.parse(body);
                expect(list.length).toEqual(groups.data.length);
                done();
            });
        });
    });

    describe('get', function() {
        it('should return correct group', function (done) {
            var expectedGroup = groups.data[0];
            request('http://localhost:3000/groups/'+expectedGroup.id, function(error, response, body){
                expect(error).toBeFalsy();
                var actualGroup = JSON.parse(body);
                expect(actualGroup.id).toEqual(expectedGroup.id);
                done();
            });
        });
    });
});