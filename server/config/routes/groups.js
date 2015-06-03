var express = require('express');
var groups = require('../../controllers/groups');
var multer  = require('multer');
var os = require('os');

module.exports = function (auth) {
    var router = express.Router();

    router.get('', auth.requiresLogin, groups.findByUser);
    router.post('', auth.requiresLogin, groups.create);
    router.get('/archive', auth.requiresLogin, groups.archive);
    router.get('/cron', groups.cron);
    router.get('/:key', auth.group.hasAccess, groups.find);
    router.put('/:key', [auth.requiresLogin, auth.group.hasAuthorization], groups.update);
    router.delete('/:key', [auth.requiresLogin, auth.group.hasAuthorization], groups.delete);
    router.post('/:key/join', auth.group.hasAccess, groups.join);
    router.post('/:key/invite', auth.requiresLogin, groups.invite);

    router.post('/:key/comments', [auth.requiresLogin],groups.addComment);
    router.delete('/:key/comments/:commentId', [auth.requiresLogin, auth.group.comment.hasAuthorization], groups.deleteComment);

    router.put('/:key/members/:memberId', [auth.requiresLogin, auth.group.member.hasAuthorization], groups.updateMember);
    router.delete('/:key/members/:memberId', [auth.requiresLogin, auth.group.member.hasAuthorization], groups.deleteMember);

    router.post('/:key/thumbnail', [auth.requiresLogin, auth.group.member.hasAuthorization, multer({ dest: os.tmpDir() }) ], groups.uploadThumbnail);

    router.post('/:key/increment', [auth.requiresLogin, auth.group.hasAuthorization], groups.increment);
    router.get('/:key/remind', [auth.requiresLogin, auth.group.hasAuthorization], groups.remindAll);
    router.get('/:key/remind/:memberId', [auth.requiresLogin], groups.remindMember);
    router.get('/:key/status', [auth.requiresLogin, auth.group.hasAuthorization], groups.status);

    router.post('/:key/login', groups.autoLogin);

    router.param('key', groups.fromKey);

    return router;
};