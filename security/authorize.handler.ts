import restify from 'restify';
import { ForbiddenError } from 'restify-errors';

/*
    Verifies if the user is authenticated and if he/she has any of the profiles received. 
    Returns a handler which is responsible to let the user proceed or not.
    It's used in user.router.ts
*/
export const authorize: (...profiles: string[]) => restify.RequestHandler = (...profiles) => {
    return (req, res, next) => {
        req.authenticated !== undefined && req.authenticated.hasAny(...profiles) 
            ? next()
            : next(new ForbiddenError('Access Denied.'));
    }
}