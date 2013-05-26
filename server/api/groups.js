var resourceful = require('resourceful');

var Group = resourceful.define('group', function () {
    this.use('memory');

    this.string('name');
    this.number('count');
});


exports.all = function(req, res) {
    Group.all(function(err, result){
        res.send(result);
    });
};

exports.get = function(req, res) {
    Group.get(req.params.id, function(err, group) {
        if(!err) {
            group.update({ count: group.count+1}, function(err, result){
                res.send(result);
            });
        }
    });
};

exports.populate = function() {
    for(var i in groups) {
        Group.create(groups[i]);
    }
};

var groups = [
    {
        id: "1",
        name: "innebandy!",
        count: 2
    },
    {
        id: "2",
        name: "ostprovning",
        count: 200
    },
    {
        id: "3",
        name: "coding jam",
        count: 1337
    },
    {
        id: "4",
        name: "spelkväll",
        count: 66
    }
];

exports.data = groups;