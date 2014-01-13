var path = require('path');
var rootPath = path.normalize(__dirname + '/../..');

module.exports = {
    development: {
		host: 'localhost',
		port: 3000,
        db: 'mongodb://localhost/rserve',
        root: rootPath,
		static: 'client',
        mailer: {
            apikey: 'jwNKk8yTVM2pTfCiApHNQw'
        },
        logger: 'dev'
    },
    test: {
		host: 'localhost',
		port: 8000,
        db: 'mongodb://localhost/rserve_test',
        root: rootPath,
		static: 'client',
        mailer: {
            apikey: null
        }
    },
    production: {
		host: 'www.arran.gr',
		port: 80,
		db: process.env.MONGOLAB_URI || 'mongodb://localhost/rserve',
		root: rootPath,
		static: 'build/client',
		mailer: {
			apikey: 'jwNKk8yTVM2pTfCiApHNQw'
		},
        logger: 'default'
    }
};