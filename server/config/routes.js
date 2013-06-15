module.exports = function (app, passport, auth) {
    var users = require('../controllers/users');
    app.get('/api/users/logout', auth.requiresLogin, users.logout);
    app.post('/api/users', users.create);
    app.get('/api/users/session', auth.requiresLogin, users.session);
    app.post('/api/users/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err); }
            if (!user) { return res.status(401).send({error: 'Authentication error'}); }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.send(user);
            });
        })(req, res, next);
    });
    app.get('/api/users/:userId', auth.requiresLogin, users.findById);

    app.param('userId', users.fromId);

    // user routes
    var groups = require('../controllers/groups');
    app.get('/api/groups', auth.requiresLogin, groups.findByUser);
    app.get('/api/groups/:key', auth.requiresLogin, groups.find);
    app.post('/api/groups', auth.requiresLogin, groups.create);
    app.post('/api/groups/:key/join', auth.requiresLogin, groups.join);
    app.put('/api/groups/:key', auth.requiresLogin, groups.update);
    app.delete('/api/groups/:key', auth.requiresLogin, groups.delete);

    app.param('key', groups.fromKey);
    app.param('groupId', groups.fromId);
};