
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var hash = require('../helpers/hash.js');
var cleaner  = require('../helpers/cleaner.js');

/**
 * User Schema
 */

var schema = new Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    hashedPassword:  { type: String },
    salt: { type: String },
    verificationHash: { type: String, unique: true },
    provider: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    verifiedAt: { type: Date },
    gravatar: { type: Boolean, default: true },
	image: {
		format: { type: String },
		data: { type: String },
		size: { type: Number }
	}
});

/**
 * Virtuals
 */

schema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

schema
    .virtual('verified')
    .get(function() {
        return !!this.verifiedAt;
    });

schema
    .virtual('hashedEmail')
    .get(function() {
        return this.hashEmail(this.email);
    });

/**
 * Validations
 */

// the below 4 validations only apply if you are signing up traditionally

schema.path('email').validate(function (email) {
    return email.length;
}, 'Email cannot be blank');

schema.path('email').validate(function (email, fn) {
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

schema.path('email').validate(function(email) {
    if(this.isNew || this.isModified('email')) {
        return (/\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}\b/).test(email);
    }
    return true;
}, 'Invalid email');

/**
 * Pre-save hook
 */

schema.pre('save', function(next) {
    if (this.isNew) {
        this.verificationHash = hash.gen(10);
    }

    if (!this.isNew && this.password && this.password.length < 6) {
        return next(new Error('Password must be atleast six characters'));
    }

    next();
});

/**
 * Methods
 */

schema.methods = {

    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */

    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashedPassword;
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
    },

	/**
	 * hash email with md5
	 *
	 * @param {String} email
	 * @return {String}
	 * @api public
	 */

	hashEmail: function (email) {
		if (!email) {
			return '';
		}

		email = email.trim();
		email = email.toLowerCase();

		var encrypted;
		try {
			encrypted = crypto.createHash('md5', this.salt).update(email).digest('hex');
			return encrypted;
		} catch (err) {
			return '';
		}
	}
};

schema.set('toJSON', { virtuals: true });
schema.options.toJSON.transform = function(doc, ret, options) {
    cleaner.removeHiddenProperties(['password', 'hashedPassword', 'salt', 'verificationHash'], ret);
};

mongoose.model('User', schema);