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
        req.authenticated !== undefined && req.authenticated.hasAny(...profiles)
            ? next()
            : next(new restify_errors_1.ForbiddenError('Access Denied.'));
    };
};
