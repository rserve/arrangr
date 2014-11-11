/**
 * Module dependencies.
 */

var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoStore = require('connect-mongo')(({session: session}));
var auth = require('./middlewares/authorization');

module.exports = function (app, config, passport) {

	app.use(require('prerender-node'));

    app.set('showStackError', true);

    if (config.logger) {
        app.use(require('morgan')(config.logger));
    }

    app.use(require('serve-favicon')(config.root + '/client/favicon.ico'));

    // should be placed before express.static
    app.use(require('compression')({
        filter: function (req, res) {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    // Route all requests that's not for static files (ending with .*) to the index page and let angular do the client routing
    app.use(function (req, res, next) {
        if (!req.url.match(/.*\..*/) && !req.url.match(/\/api\/.*/)) {
            req.url = '/index.html';
        }
        next();
    });

    app.use(express.static(config.static));
    app.use('/node_modules', express.static('node_modules'));

    // cookieParser should be above session
    app.use(require('cookie-parser')());

    // bodyParser should be above methodOverride

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(require('method-override')());

    // express/mongo session storage
    app.use(session({
        secret: 'rserve',
        resave: true,
        saveUninitialized: false,
            store: new mongoStore({
            url: config.db,
            collection : 'sessions'
        })
    }));

    // use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    // Bootstrap routes
    app.use('/api/users', require('./routes/users')(passport, auth));
    app.use('/api/groups', require('./routes/groups')(auth));

    // assume "not found" in the error msgs
    // is a 404. this is somewhat silly, but
    // valid, you can do whatever you like, set
    // properties, use instanceof etc.
    app.use(function(err, req, res, next){
        // treat as 404
        if (~err.message.indexOf('not found')) return next();

        // log it
        console.error(err.stack);

        // error page
        res.status(500).send({ error: err.stack });
    });

    // assume 404 since no middleware responded
    app.use(function(req, res, next){
        res.status(404).send({ url: req.originalUrl, error: 'Not found' });
    });

};