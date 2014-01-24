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
    res.status(403).send({error: 'Unauthorized', message: message});
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
	hasAccess: function(req, res, next) {
		if(req.group.public || req.user && req.group.isMember(req.user)) {
			return next();
		}

		return sendUnauthorized(res, 'User has no access to group');
	},
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
            if(req.group.isAdmin(req.user) || req.group.isMember(req.user, req.params.memberId)) {
                return next();
            }

            return sendUnauthorized(res, 'User not authorized for this member ');
        }
    },

	comment: {
		hasAuthorization: function(req, res, next) {
			// user is authorized if owner of comment
			if(req.group.ownsComment(req.user, req.params.commentId)) {
				return next();
			}

			return sendUnauthorized(res, 'User not authorized for this comment ');
		}
	}
};
