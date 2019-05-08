import jestCLI from 'jest-cli';

import { Server } from './server/server';
import { environment } from './common/environment';

import { usersRouter } from './users/users.router';
import { User } from './users/users.model';
import { reviewsRouter } from './reviews/reviews.router';
import { Review } from './reviews/reviews.model';
import { restaurantsRouter } from './restaurants/restaurants.router';
import { Restaurant } from './restaurants/restaurants.model';

declare module 'restify' {
    //Exports a new interface for restify, used in 'token.parser.ts' where the object 'req' will have a property 'authenticated' of type User: req.authenticated = user;
    interface Request {
        authenticated: User
    }
}

let server: Server;

const beforeAllTests = () => {
    //Creates a new server for testing with a new port and database
    environment.database.url = process.env.DB_URL || 'mongodb://localhost/node-restapi-test-db'
    environment.server.port = process.env.SERVER_PORT || 3001
    
    server = new Server()
    return server.bootstrap([
        usersRouter, 
        restaurantsRouter, 
        reviewsRouter
    ])
    .then(() => {
        //Cleans up before initializing
        Promise.all([
            User.deleteMany({}).exec(),
            registerNewUser(),
            Review.deleteMany({}).exec(),
            Restaurant.deleteMany({}).exec()
        ]);
    })
    .catch(console.error)
}


const registerNewUser = (): Promise<User> => {    
    let admin = new User;
    admin.name = 'Anderson Cruz';
    admin.email = 'andersoncscz@hotmail.com';
    admin.password = '123changeit';
    admin.profiles = ['admin', 'user'];

    return admin.save();
}


const afterAllTests = () => {
    //Shutdown the test server
    return server.shutdown();
}

beforeAllTests()
    .then(() => jestCLI.run())
    .then(() => afterAllTests())
    .catch(error => {
        console.error(error);
        process.exit(1);
    })