module.exports = function (app, passport, auth) {
    var users = require('../controllers/users');
    app.post('/api/users', users.create);
    app.post('/api/users/login', function(req, res, next) {
        users.login(req, res, next, passport);
    });
    app.get('/api/users/logout', auth.requiresLogin, users.logout);
    app.get('/api/users/session', auth.requiresLogin, users.session);
    app.get('/api/users/:userId', auth.requiresLogin, users.findById);
    app.get('/api/users/verify/:hash', users.verify);

    app.param('userId', users.fromId);

    var groups = require('../controllers/groups');
    app.get('/api/groups/:key', groups.find);
    app.post('/api/groups/:key/join', groups.join);
    app.get('/api/groups', auth.requiresLogin, groups.findByUser);
    app.post('/api/groups', auth.requiresLogin, groups.create);
    app.post('/api/groups/:key/invite', auth.requiresLogin, groups.invite);
    app.put('/api/groups/:key', auth.requiresLogin, groups.update);
    app.delete('/api/groups/:key', auth.requiresLogin, groups.delete);

    app.put('/api/groups/members/:memberId', auth.requiresLogin, groups.updateMember);

    app.param('key', groups.fromKey);
    app.param('groupId', groups.fromId);
};