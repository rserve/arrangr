var crypto = require('crypto');

exports.gen = function(len) {
    if (!len) {
        len = 7;
    }

    var bytesNeeded = Math.ceil(len * 0.75);
    var buf = crypto.pseudoRandomBytes(bytesNeeded);
    var id = buf.toString('base64').substring(0, len);
    id = id.replace('+', '-');
    id = id.replace('/', '_');
    return id;
};

exports.md5 = function(data) {
	return crypto.createHash('md5').update(data).digest("hex");
};