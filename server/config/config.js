var path = require('path');
var rootPath = path.normalize(__dirname + '/../..');

module.exports = {
    development: {
        db: 'mongodb://localhost/rserve',
        root: rootPath,
        mailer: {
            apikey: 'jwNKk8yTVM2pTfCiApHNQw'
        },
        logger: 'dev'
    },
    test: {
        db: 'mongodb://localhost/rserve_test',
        root: rootPath,
        mailer: {
            apikey: 'jwNKk8yTVM2pTfCiApHNQw'
        }
    },
    production: {
        logger: 'default'
    }
};