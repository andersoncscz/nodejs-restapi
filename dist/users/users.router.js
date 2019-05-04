"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_handler_1 = require("../security/auth.handler");
const users_model_1 = require("./users.model");
const model_router_1 = require("../common/model-router");
const authorize_handler_1 = require("../security/authorize.handler");
const restify_errors_1 = require("restify-errors");
class UsersRouter extends model_router_1.ModelRouter {
    constructor() {
        super(users_model_1.User);
        this.findByEmail = (req, res, next) => {
            req.query.email ? users_model_1.User.findByEmail(req.query.email)
                .then(user => user ? [user] : [])
                .then(this.renderAll(res, next, { paginationLimit: this.paginationLimit, url: req.url }))
                .catch(next)
                : next();
        };
        this.validateChanges = (req, res, next) => {
            if (!req.authenticated.profiles.some(profile => profile === 'admin')) {
                //Applies a validation to guarantee that only 'admin' profile can update other users.
                if (req.params.id === req.authenticated.id) {
                    return next();
                }
                else {
                    next(new restify_errors_1.ForbiddenError('Access Denied.'));
                }
            }
            next();
        };
        this.applyRoutes = (application) => {
            //Applies authorize method which is responsible to check if some profile is allow to access some route
            application.get(`${this.basePath}`, [authorize_handler_1.authorize('admin'), this.findByEmail, this.find]);
            application.get(`${this.basePath}/:id`, [authorize_handler_1.authorize('admin'), this.validateId, this.findById]);
            application.post(`${this.basePath}`, [authorize_handler_1.authorize('admin'), this.save]);
            application.put(`${this.basePath}/:id`, [authorize_handler_1.authorize('admin', 'user'), this.validateChanges, this.validateId, this.replace]);
            application.patch(`${this.basePath}/:id`, [authorize_handler_1.authorize('admin', 'user'), this.validateChanges, this.validateId, this.update]);
            application.del(`${this.basePath}/:id`, [authorize_handler_1.authorize('admin'), this.validateId, this.delete]);
            //Open route
            application.post(`${this.basePath}/authenticate`, auth_handler_1.authenticate);
        };
        this.on('beforeRender', document => document.password = undefined);
    }
}
exports.usersRouter = new UsersRouter();
