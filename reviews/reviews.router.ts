import restify from 'restify';
import mongoose from 'mongoose';
import { Review } from './reviews.model';
import { ModelRouter } from '../common/model-router';
import { authorize } from '../security/authorize.handler';


class ReviewsRouter extends ModelRouter<Review> {
    constructor() {
        super(Review);
    }

    //Overrides prepareOne() from ModelRouter, which will return a new query with populate bound. works like a sql join
    protected prepareOne = (query: mongoose.DocumentQuery<Review,Review>): mongoose.DocumentQuery<Review,Review> => {
        return query
                .populate('user', 'name')
                .populate('restaurant', 'name');
    }

    envelope(document) {
        const restaurantId = document.restaurant._id ? document.restaurant._id : document.restaurant;
        let resource = super.envelope(document);
        resource._links.restaurant = `${this.baseUrl}/restaurants/${restaurantId}`;
        return resource;
    }

    applyRoutes = (application: restify.Server) => {
        
        application.get(`${this.basePath}`, this.find);        
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById]);
        application.post(`${this.basePath}`, [authorize('admin'), this.save]);
    }
}

export const reviewsRouter = new ReviewsRouter();