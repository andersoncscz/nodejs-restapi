"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reviews_model_1 = require("./reviews.model");
const model_router_1 = require("../common/model-router");
class ReviewsRouter extends model_router_1.ModelRouter {
    constructor() {
        super(reviews_model_1.Review);
        //Overrides prepareOne() from ModelRouter, which will return a new query with populate bound
        this.prepareOne = (query) => {
            return query
                .populate('user', 'name')
                .populate('restaurant', 'name');
        };
        this.applyRoutes = (application) => {
            application.get('/reviews', this.find);
            application.get('/reviews/:id', [this.validateId, this.findById]);
            application.post('/reviews', this.save);
        };
    }
}
exports.reviewsRouter = new ReviewsRouter();
