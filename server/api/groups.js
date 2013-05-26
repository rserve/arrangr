var resourceful = require('resourceful');

var Group = resourceful.define('group', function () {
    this.use('memory');

    this.string('name');
    this.number('count');
});


exports.find = function(req, res) {
    Group.all(function(err, result){
        res.send(result);
    });
};

exports.get = function(req, res) {
    Group.get(req.params.id, function(err, group) {
        group.update({ count: group.count+1}, function(err, result){
            res.send(result);
        });
    });
};

exports.populate = function() {

    var groups = [
        {
            "name": "innebandy!",
            "count": 2
        },
        {
            "name": "ostprovning",
            "count": 200
        },
        {
            "name": "coding jam",
            "count": 1337
        },
        {
            "name": "spelkväll",
            "count": 66
        }
    ];

    for(var i in groups) {
        Group.create(groups[i]);
    }
};