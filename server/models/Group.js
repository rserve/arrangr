var mongoose = require('mongoose');
var hash = require('../helpers/hash.js');
var cleaner  = require('../helpers/cleaner.js');
var moment = require('moment');

var schema = new mongoose.Schema({
    key: { type: String },
    name: { type: String, required: true },
    description: { type: String },
    image: {
      format: { type: String },
      data: { type: String },
      size: { type: Number }
    },
    startDate: { type: Date, default: moment().add('hours', 1).toDate() },
    endDate: { type: Date },
    public: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    members: [{
        user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
        status: {type: String, enum: ['Yes', 'No', 'Maybe', ''], default: '' },
        admin: { type: Boolean, default: false },
        createdAt: {type: Date, default: Date.now }
    }],
	comments: [{
		userRefId: {type: String, default: '' },
		hashedEmail: {type: String, default: '' },
		text: {type: String, default: '' },
		author: {type: String, default: '' },
		createdAt: {type: Date, default: Date.now }
	}]
});

schema.pre('save', function (next) {
    if (!this.key) {
		// TODO: Check if key exits
        this.key = hash.gen(5);
    }
    next();
});

schema.set('toJSON', { virtuals: true });
schema.options.toJSON.transform = function(doc, ret, options) {
    cleaner.removeHiddenProperties(ret);
};

schema.methods = {

	isAdmin: function (user) {

		return this.members.some(function (member) {
			return member.admin && member.user && member.user.id === user.id;
		});
	},

	// check if user belongs to a member
	isMember: function (user, memberId) {
		return this.members.some(function (member) {
			return member.id === memberId && member.user && member.user.id === user.id;
		});
	},

	// check if user owns comment
	ownsComment: function (user, commentId) {

		return this.comments.some(function (comment) {
			return comment.id === commentId && comment.userRefId === user.id;
		});
	}
};

module.exports = mongoose.model('Group', schema);
