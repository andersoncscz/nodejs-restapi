import restify from 'restify';

import { authenticate } from '../security/auth.handler';
import { User } from './users.model';
import { ModelRouter } from '../common/model-router';
import { authorize } from '../security/authorize.handler';
import { ForbiddenError } from 'restify-errors';

class UsersRouter extends ModelRouter<User> {
    
    constructor() {
        super(User);
        this.on('beforeRender', document => document.password = undefined);
    }

    findByEmail = (req, res, next) => {
        req.query.email ? User.findByEmail(req.query.email)
            .then(user => user ? [user] : [])
            .then(this.renderAll(res, next, { paginationLimit: this.paginationLimit, url: req.url }))
            .catch(next)
        : next();
    }
    
    validateChanges = (req, res, next) => {
        if (!req.authenticated.profiles.some(profile => profile === 'admin')) {
            //Applies a validation to guarantee that only 'admin' profile can update other users.
            if (req.params.id === req.authenticated.id) {
                return next();
            }
            else {
                next(new ForbiddenError('Access Denied.'));
            }
        }
        next();
    }

    applyRoutes = (application: restify.Server) => {
        
        //Applies authorize method which is responsible to check if some profile is allow to access some route
        application.get(`${this.basePath}`, [authorize('admin'), this.findByEmail, this.find]);
        application.get(`${this.basePath}/:id`, [authorize('admin'), this.validateId, this.findById]);
        application.post(`${this.basePath}`, [authorize('admin'), this.save]);
        application.put(`${this.basePath}/:id`, [authorize('admin', 'user'), this.validateChanges, this.validateId, this.replace]);
        application.patch(`${this.basePath}/:id`, [authorize('admin', 'user'), this.validateChanges, this.validateId, this.update]);
        application.del(`${this.basePath}/:id`, [authorize('admin'), this.validateId, this.delete]);

        //Open route
        application.post(`${this.basePath}/authenticate`, authenticate);
    }
}

export const usersRouter = new UsersRouter();