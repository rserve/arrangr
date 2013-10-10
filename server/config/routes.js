module.exports = function (app, passport, auth) {



    app.namespace('/api', function() {

        app.namespace('/users', function() {
            var users = require('../controllers/users');

            app.post('', users.create);
            app.post('/login', function(req, res, next) {
                users.login(req, res, next, passport);
            });
            app.get('/logout', auth.requiresLogin, users.logout);
            app.get('/session', auth.requiresLogin, users.session);
            app.get('/:userId', auth.requiresLogin, users.findById);
            app.put('/:userId', auth.user.hasAuthorization, users.update);
            app.get('/verify/:hash', users.verify);

            app.param('userId', users.fromId);
        });

        app.namespace('/groups', function() {
            var groups = require('../controllers/groups');

            app.get('/:key', groups.find);
            app.post('/join', groups.join);
            app.get('', auth.requiresLogin, groups.findByUser);
            app.post('', auth.requiresLogin, groups.create);
            app.post('/:key/invite', auth.requiresLogin, groups.invite);
            app.put('/:key', [auth.requiresLogin, auth.group.hasAuthorization], groups.update);
            app.delete('/:key', [auth.requiresLogin, auth.group.hasAuthorization], groups.delete);

            app.put('/:key/members/:memberId', [auth.requiresLogin, auth.group.member.hasAuthorization], groups.updateMember);
            app.delete('/:key/members/:memberId', [auth.requiresLogin, auth.group.member.hasAuthorization], groups.deleteMember);

            app.post('/:key/thumbnail', [auth.requiresLogin, auth.group.member.hasAuthorization], groups.uploadThumbnail);

            app.param('key', groups.fromKey);
            app.param('groupId', groups.fromId);
        });
    });
};