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

function sendUnauthorized(res, message) {
    res.status(403).send(message);
}

exports.user = {
    hasAuthorization : function (req, res, next) {
        // user is authorized if self
        if (req.profile.id == req.user.id) {
            return next();
        }

        return sendUnauthorized(res, 'User not authorized');
    }
};

exports.group = {
    hasAuthorization: function(req, res, next) {
        // user is authorized if admin in group
        if(req.group.isAdmin(req.user)) {
            return next();
        }

        return sendUnauthorized(res, 'User not authorized for group');
    },
    member: {
        hasAuthorization: function(req, res, next) {
            // user is authorized if admin or trying to update own membership
            if(req.group.isAdmin(req.user) || req.group.isMember(req.user, req.params.memberId)
				//req.params.memberId == req.user.id
				 ) {
                return next();
            }

            return sendUnauthorized(res, 'User not authorized for this groupmember ' +req.params.memberId+', '+req.user.id);
        }
    }
};
