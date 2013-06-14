module.exports = function (app, passport, auth) {
    var users = require('../controllers/users');
    app.get('/api/users/logout', users.logout);
    app.post('/api/users', users.create);
    app.post('/api/users/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err); }
            if (!user) { return res.status(401).send({error: 'Authentication error'}); }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.send();
            });
        })(req, res, next);
    });
    app.get('/api/users/:userId', users.show);

    app.param('userId', users.user);

    // user routes
    var groups = require('../controllers/groups');
    app.get('/api/groups', groups.findAll);
    app.get('/api/groups/:key', groups.findByKey);
    app.post('/api/groups', groups.create);
    app.put('/api/groups/:key', groups.update);
    app.delete('/api/groups/:key', groups.delete);
};