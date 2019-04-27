import * as restify from 'restify';
import * as mongoose from 'mongoose';
import { Review } from './reviews.model';
import { ModelRouter } from '../common/model-router';


class ReviewsRouter extends ModelRouter<Review> {
    constructor() {
        super(Review);
    }

    //Overrides prepareOne() from ModelRouter, which will return a new query with populate bound
    protected prepareOne = (query: mongoose.DocumentQuery<Review,Review>): mongoose.DocumentQuery<Review,Review> => {
        return query
                .populate('user', 'name')
                .populate('restaurant', 'name');
    }

    applyRoutes = (application: restify.Server) => {
        
        application.get('/reviews', this.find);        
        application.get('/reviews/:id', [this.validateId, this.findById]);
        application.post('/reviews', this.save);
    }
}

export const reviewsRouter = new ReviewsRouter();