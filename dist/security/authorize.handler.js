"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify_errors_1 = require("restify-errors");
/*
    Verifies if the user is authenticated and if he/she has any of the profiles received.
    Returns a handler which is responsible to let the user proceed or not.
    It's used in user.router.ts
*/
exports.authorize = (...profiles) => {
    return (req, res, next) => {
        if (req.authenticated !== undefined && req.authenticated.hasAny(...profiles)) {
            //Logs an access granted.
            req.log.debug('Access granted for user: %s with profiles: %j on route: %s. Required profiles: %j', req.authenticated._id, req.authenticated.profiles, req.path, profiles);
            next();
        }
        else {
            if (req.authenticated) {
                //Logs an access denied.
                req.log.debug('Access denied for user: %s. Required profiles: %j. Profiles given: %j', req.authenticated._id, profiles, req.authenticated.profiles);
            }
            next(new restify_errors_1.ForbiddenError('Access Denied.'));
        }
    };
};
