"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reviews_model_1 = require("./reviews.model");
const model_router_1 = require("../common/model-router");
const authorize_handler_1 = require("../security/authorize.handler");
class ReviewsRouter extends model_router_1.ModelRouter {
    constructor() {
        super(reviews_model_1.Review);
        //Overrides prepareOne() from ModelRouter, which will return a new query with populate bound. works like a sql join
        this.prepareOne = (query) => {
            return query
                .populate('user', 'name')
                .populate('restaurant', 'name');
        };
        this.applyRoutes = (application) => {
            application.get(`${this.basePath}`, this.find);
            application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
            application.post(`${this.basePath}`, [authorize_handler_1.authorize('admin'), this.save]);
        };
    }
    envelope(document) {
        const restaurantId = document.restaurant._id ? document.restaurant._id : document.restaurant;
        let resource = super.envelope(document);
        resource._links.restaurant = `/restaurants/${restaurantId}/menu`;
        return resource;
    }
}
exports.reviewsRouter = new ReviewsRouter();
