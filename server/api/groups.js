var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server(process.env.DB_HOST || 'localhost', process.env.DB_PORT || 27017, {auto_reconnect: true});
var db = new Db(process.env.DB_NAME || 'rserve', server, {safe: true});

db.open(function(err, db) {
    if(err) {
        console.log("Error connecting to database: " + err);
    } else {
        console.log("Connected to database");
        db.collection('groups', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'groups' collection doesn't exist. Creating it with sample data...");
                dao.populate();
            }
        });
    }
});

var groups = [
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

//Data Access Interface
var dao = {
    findAll: function(req, res) {
        db.collection('groups', function(err, collection) {
            collection.find().toArray(function(err, items) {
                res.send(items);
            });
        });
    },
    findById: function(req, res) {
        var id = req.params.id;
        db.collection('groups', function(err, collection) {
            collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
                res.send(item);
            });
        });
     },
    create: function(req, res) {
        var group = req.body;
        group.count = 0;
        db.collection('groups', function(err, collection) {
            collection.insert(group, {safe:true}, function(err, result) {
                if (err) {
                    console.log('Error creating group: ' + err);
                    res.send({'error':'An error has occurred'});
                } else {
                    res.send(result[0]);
                }
            });
        });
    },
    update: function(req, res) {
        var id = req.params.id;
        var group = req.body;
        db.collection('groups', function(err, collection) {
            collection.update({'_id':new BSON.ObjectID(id)}, group, {safe:true}, function(err, result) {
                if (err) {
                    console.log('Error updating group: ' + err);
                    res.send({'error':'An error has occurred'});
                } else {
                    res.send(group);
                }
            });
        });
    },
    delete: function(req, res) {
        var id = req.params.id;
        db.collection('groups', function(err, collection) {
            collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
                if (err) {
                    console.log('Error deleting group: ' + err);
                    res.send({'error':'An error has occurred - ' + err});
                } else {
                    res.send(req.body);
                }
            });
        });
    },
    populate: function() {
        db.collection('groups', function(err, collection) {
            collection.insert(groups, {safe:true}, function(err, result) {});
        });
    },
    data: groups
};

module.exports = dao;