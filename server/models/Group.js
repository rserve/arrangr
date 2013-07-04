var mongoose = require('mongoose');
var hash = require('../helpers/hash.js');

var schema = new mongoose.Schema({
    key: { type: String, unique: true },
    name: { type: String, required: true },
    public: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    members: [{
        user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
        status: {type: String, enum: ['Yes', 'No', 'Maybe'], default: '' },
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

schema.set('toJSON', { virtuals: true });
schema.options.toJSON.transform = function (doc, ret, options) {
    ['_id', '__v'].forEach(function (prop) {
        delete ret[prop];
    });
};


module.exports = mongoose.model('Group', schema);
