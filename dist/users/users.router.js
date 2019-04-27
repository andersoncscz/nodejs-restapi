"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_model_1 = require("./users.model");
const model_router_1 = require("../common/model-router");
class UsersRouter extends model_router_1.ModelRouter {
    constructor() {
        super(users_model_1.User);
        this.applyRoutes = (application) => {
            application.get('/users', this.find);
            application.get('/users/:id', [this.validateId, this.findById]);
            application.post('/users', this.save);
            application.put('/users/:id', [this.validateId, this.replace]);
            application.patch('/users/:id', [this.validateId, this.update]);
            application.del('/users/:id', [this.validateId, this.delete]);
        };
        this.on('beforeRender', document => delete document.password);
    }
}
exports.usersRouter = new UsersRouter();
