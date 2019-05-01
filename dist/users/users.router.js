"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_model_1 = require("./users.model");
const model_router_1 = require("../common/model-router");
class UsersRouter extends model_router_1.ModelRouter {
    constructor() {
        super(users_model_1.User);
        this.findByEmail = (req, res, next) => {
            req.query.email ? users_model_1.User.findByEmail(req.query.email)
                .then(user => user ? [user] : [])
                .then(this.renderAll(res, next))
                .catch(next)
                : next();
        };
        this.applyRoutes = (application) => {
            application.get(`${this.basePath}`, [this.findByEmail, this.find]);
            application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
            application.post(`${this.basePath}`, this.save);
            application.put(`${this.basePath}/:id`, [this.validateId, this.replace]);
            application.patch(`${this.basePath}/:id`, [this.validateId, this.update]);
            application.del(`${this.basePath}/:id`, [this.validateId, this.delete]);
        };
        this.on('beforeRender', document => document.password = undefined);
    }
}
exports.usersRouter = new UsersRouter();
