"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restaurants_model_1 = require("./restaurants.model");
const model_router_1 = require("../common/model-router");
const restify_errors_1 = require("restify-errors");
class RestaurantsRouter extends model_router_1.ModelRouter {
    constructor() {
        super(restaurants_model_1.Restaurant);
        this.findMenu = (req, res, next) => {
            restaurants_model_1.Restaurant.findById(req.params.id, '+menu').then(restaurant => {
                if (!restaurant) {
                    throw new restify_errors_1.NotFoundError('Restaurant not found');
                }
                else {
                    res.json(restaurant.menu);
                    return next();
                }
            }).catch(next);
        };
        this.replaceMenu = (req, res, next) => {
            restaurants_model_1.Restaurant.findById(req.params.id).then(restaurant => {
                if (!restaurant) {
                    throw new restify_errors_1.NotFoundError('Restaurant not found');
                }
                else {
                    restaurant.menu = req.body;
                    return restaurant.save();
                }
            })
                .then(restaurant => res.json(restaurant.menu))
                .catch(next);
        };
        this.applyRoutes = (application) => {
            application.get('/restaurants', this.find);
            application.get('/restaurants/:id', [this.validateId, this.findById]);
            application.post('/restaurants', this.save);
            application.put('/restaurants/:id', [this.validateId, this.replace]);
            application.patch('/restaurants/:id', [this.validateId, this.update]);
            application.del('/restaurants/:id', [this.validateId, this.delete]);
            application.get('/restaurants/:id/menu', [this.validateId, this.findMenu]);
            application.put('/restaurants/:id/menu', [this.validateId, this.replaceMenu]);
        };
    }
}
exports.restaurantsRouter = new RestaurantsRouter();
