import restify from 'restify';

import { User } from './users.model';
import { ModelRouter } from '../common/model-router';

class UsersRouter extends ModelRouter<User> {
    
    constructor() {
        super(User);
        this.on('beforeRender', document => document.password = undefined);
    }

    findByEmail = (req, res, next) => {
        req.query.email ? User.findByEmail(req.query.email)
            .then(user => user ? [user] : [])
            .then(this.renderAll(res, next))
            .catch(next)
        : next();
    }

    applyRoutes = (application: restify.Server) => {
        
        application.get(`${this.basePath}`, [this.findByEmail, this.find]);
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.post(`${this.basePath}`, this.save);
        application.put(`${this.basePath}/:id`, [this.validateId, this.replace]);
        application.patch(`${this.basePath}/:id`, [this.validateId, this.update]);
        application.del(`${this.basePath}/:id`, [this.validateId, this.delete]);
    }
}

export const usersRouter = new UsersRouter();