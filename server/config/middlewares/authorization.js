/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).send();
    }
    next();
};


/*
 *  User authorizations routing middleware
 */

exports.user = {
    hasAuthorization : function (req, res, next) {
        if (req.profile.id != req.user.id) {
            return res.status(403).send();
        }
        next();
    }
};

exports.group = {
    hasAuthorization: function(req, res, next) {
        for (var i = 0, len = req.group.members.length; i < len; i++) {
            var member = req.group.members[i];
            if (member.admin && member.user && member.user.id === req.user.id) {
                next();
                return;
            }
        }
        return res.status(403).send();
    }
};
