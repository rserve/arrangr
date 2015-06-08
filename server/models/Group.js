var mongoose = require('mongoose');
var hash = require('../helpers/hash.js');
var cleaner = require('../helpers/cleaner.js');
var moment = require('moment');

var member = new mongoose.Schema({
    user: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
    status: {type: String, enum: ['Yes', 'No', 'Maybe', ''], default: ''},
    admin: {type: Boolean, default: false},
    createdAt: {type: Date, default: Date.now},
    _hash: {type: String, default: hash.gen}
});
member.set('toJSON', {virtuals: true});

var schema = new mongoose.Schema({
    key: {type: String},
    name: {type: String, required: true},
    description: {type: String},
    image: {
        format: {type: String},
        data: {type: String},
        size: {type: Number}
    },
    startDate: {
        type: Date,
        default: function () {
            return moment().add(2, 'hours').minute(0).second(0).toDate();
        }
    },
    endDate: {type: Date},
    public: {type: Boolean, default: false},
    autoCycle: {type: Boolean, default: true},
    createdAt: {type: Date, default: Date.now},
    createdBy: {type: mongoose.Schema.ObjectId, ref: 'User'},
    members: [member],
    comments: [{
        user: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
        text: {type: String, default: ''},
        createdAt: {type: Date, default: Date.now}
    }],
    minParticipants: {type: Number},
    maxParticipants: {type: Number},
    incrementDays: {type: Number, default: 7}
});

schema.pre('save', function (next) {
    if (!this.key) {
        // TODO: Check if key exits
        this.key = hash.gen(5);
    }

    next();
});

schema.path('endDate').validate(function (endDate) {
    return !endDate || moment(endDate).isAfter(this.startDate);
}, 'End date must be after start date');

schema.path('incrementDays').validate(function (incrementDays) {
    return incrementDays > 0;
}, 'Interval must be positive.');

schema.set('toObject', {virtuals: true});
schema.set('toJSON', {virtuals: true});
schema.options.toJSON.transform = function (doc, ret, options) {
    cleaner.removeHiddenProperties(ret);
};

schema.methods = {

    member: function (user) {
        if (user) {
            for (var i = 0, len = this.members.length; i < len; i++) {
                var member = this.members[i];
                if (member.user && member.user.id === user.id) {
                    return member;
                }
            }
        }
        return null;
    },

    isAdmin: function (user) {
        return this.members.some(function (member) {
            return member.admin && member.user && member.user.id === user.id;
        });
    },

    // check if user member
    isMember: function (user) {
        return !!this.member(user);
    },

    isSelf: function (user, memberId) {
        return this.members.some(function (member) {
            return member.id === memberId && member.user && member.user.id === user.id;
        });
    },

    // check if user owns comment
    ownsComment: function (user, commentId) {
        return this.comments.some(function (comment) {
            return comment.id === commentId && comment.user.id === user.id;
        });
    },

    statusCount: function (status) {
        return this.members.filter(function (member) {
            return member.status == status;
        }).length;
    }
};

module.exports = mongoose.model('Group', schema);
