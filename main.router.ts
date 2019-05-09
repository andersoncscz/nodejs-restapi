import { Router } from './common/router';
import restify from 'restify';

class MainRouter extends Router {
    applyRoutes = (application: restify.Server) => {
        application.get('/', (req, res, next) => {
            res.json({
                _links: {
                    users: '/users',
                    restaurants: '/restaurants',
                    reviews: '/reviews',
                },
                version: '1.0.0'
            })
        })
    }
}

export const mainRouter = new MainRouter();