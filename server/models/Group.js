var mongoose = require('mongoose');
var hash = require('../helpers/hash.js');

var schema = new mongoose.Schema({
    key: { type: String, unique: true },
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    members: [{
        user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
        status: {type: String, enum: ['Yes', 'No', 'Maybe'], default: 'No' },
        admin: { type: Boolean, default: false },
        createdAt: {type: Date, default: Date.now }
    }]
});

schema.pre('save', function (next) {
    if (!this.key) {
        this.key = hash.gen(5);
    }
    next();
});

module.exports = mongoose.model('Group', schema);
