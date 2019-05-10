import { Router } from './common/router';
import restify from 'restify';

class MainRouter extends Router {
    applyRoutes = (application: restify.Server) => {
        application.get('/', (req, res, next) => {
            res.json({
                _links: {
                    users: {
                        users: `${this.baseUrl}/users`,
                        authentication: `${this.baseUrl}/users/authenticate`,
                    },
                    restaurants: `${this.baseUrl}/restaurants`,
                    reviews: `${this.baseUrl}/reviews`,
                },
                version: '1.0.0'
            })
        })
    }
}

export const mainRouter = new MainRouter();