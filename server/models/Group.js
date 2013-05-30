var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    name: String,
    count: Number
});

module.exports = mongoose.model('Group', schema);
