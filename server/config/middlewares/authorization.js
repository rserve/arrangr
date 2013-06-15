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
