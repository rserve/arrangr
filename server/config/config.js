var path = require('path');
var rootPath = path.normalize(__dirname + '/../..');

module.exports = {
    development: {
		host: 'localhost',
		port: 3000,
        db: 'mongodb://heroku_app20594163_A:prSWacetlfvBsUiRplWblepKLtHBqTUu@ds063178.mongolab.com:63178/heroku_app20594163',
        root: rootPath,
		static: 'client',
        logger: 'dev'
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
		static: 'build',
        logger: 'combined'
    }
};