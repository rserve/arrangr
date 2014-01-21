var path = require('path');
var rootPath = path.normalize(__dirname + '/../..');

module.exports = {
    development: {
		host: 'localhost',
		port: 3000,
        db: 'mongodb://localhost/rserve',
        root: rootPath,
		static: 'client',
        logger: 'dev',
		mandrill: 'pB_BN80OtE1oUBvda0Xtkg'
    },
    test: {
		host: 'localhost',
		port: 8000,
        db: 'mongodb://localhost/rserve_test',
        root: rootPath,
		static: 'client'
    },
    production: {
		host: 'www.arran.gr',
		port: 80,
		db: process.env.MONGOLAB_URI || 'mongodb://localhost/rserve',
		root: rootPath,
		static: 'build/client',
        logger: 'default'
    }
};