var express = require('express');
var users = require('../../controllers/users');

module.exports = function (passport, auth) {
    var router = express.Router();

    router.post('', users.create);
    router.post('/login', function(req, res, next) {
        users.login(req, res, next, passport);
    });
    router.get('/logout', auth.requiresLogin, users.logout);
    router.get('/session', auth.requiresLogin, users.session);
    router.post('/password', users.password);
    router.get('/:userId', auth.requiresLogin, users.findById);
    router.put('/:userId', auth.user.hasAuthorization, users.update);
    router.post('/:userId/thumbnail', [auth.requiresLogin, auth.user.hasAuthorization], users.uploadThumbnail);

    router.param('userId', users.fromId);
    
    return router;
};