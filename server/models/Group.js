var mongoose = require('mongoose');
var crypto = require('crypto');

var schema = new mongoose.Schema({
    key: {
        type: String,
        unique: true
    },
    name: String,
    createdAt  : {type : Date, default: Date.now},
    members: [{
        user: { type: mongoose.Schema.ObjectId, ref: 'User' },
        status: {type: String, enum: ['Yes', 'No', 'Maybe'], default: 'No'},
        admin: { type: Boolean, default: false },
        createdAt  : {type : Date, default: Date.now}
    }]
});

schema.pre('save', true, function (next, done) {
    var self = this;
    next();
    if(!this.key) {
        genkey(5, function(key) {
            self.key = key;
            done();
        });
    }
});

function genkey(len, cb) {
    if (!cb) {
        cb = len;
        len = 7;
    }

    var bytesNeeded = Math.ceil(len * 0.75);
    crypto.pseudoRandomBytes(bytesNeeded, function(err, buf) {
        var id = buf.toString('base64').substring(0, len);
        id = id.replace('+', '-');
        id = id.replace('/', '_');
        cb(id);
    });
}

module.exports = mongoose.model('Group', schema);
