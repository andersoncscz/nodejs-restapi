import jestCLI from 'jest-cli';

import { Server } from './server/server';
import { environment } from './common/environment';

import { usersRouter } from './users/users.router';
import { User } from './users/users.model';
import { reviewsRouter } from './reviews/reviews.router';
import { Review } from './reviews/reviews.model';
import { restaurantsRouter } from './restaurants/restaurants.router';
import { Restaurant } from './restaurants/restaurants.model';


let server: Server;

const beforeAllTests = () => {
    //Creates a new server for testing, with a db test and using other port
    environment.database.url = process.env.DB_URL || 'mongodb://localhost/node-restapi-test-db'
    environment.server.port = process.env.SERVER_PORT || 80
    
    server = new Server()
    return server.bootstrap([
        usersRouter, 
        restaurantsRouter, 
        reviewsRouter
    ]) //Cleans up before initilizing
    .then(() => User.deleteMany({}).exec())
    .then(() => Review.deleteMany({}).exec())
    .then(() => Restaurant.deleteMany({}).exec())
    .catch(console.error)
}

const afterAllTests = () => {
    //Shutdown the test server
    return server.shutdown();
}

beforeAllTests()
    .then(() => jestCLI.run())
    .then(() => afterAllTests())
    .catch(console.error)