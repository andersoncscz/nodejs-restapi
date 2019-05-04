"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jest_cli_1 = __importDefault(require("jest-cli"));
const server_1 = require("./server/server");
const environment_1 = require("./common/environment");
const users_router_1 = require("./users/users.router");
const users_model_1 = require("./users/users.model");
const reviews_router_1 = require("./reviews/reviews.router");
const reviews_model_1 = require("./reviews/reviews.model");
const restaurants_router_1 = require("./restaurants/restaurants.router");
const restaurants_model_1 = require("./restaurants/restaurants.model");
let server;
const beforeAllTests = () => {
    //Creates a new server for testing with a new port and database
    environment_1.environment.database.url = process.env.DB_URL || 'mongodb://localhost/node-restapi-test-db';
    environment_1.environment.server.port = process.env.SERVER_PORT || 3001;
    server = new server_1.Server();
    return server.bootstrap([
        users_router_1.usersRouter,
        restaurants_router_1.restaurantsRouter,
        reviews_router_1.reviewsRouter
    ])
        .then(() => {
        //Cleans up before initializing
        Promise.all([
            users_model_1.User.deleteMany({}).exec(),
            registerNewUser(),
            reviews_model_1.Review.deleteMany({}).exec(),
            restaurants_model_1.Restaurant.deleteMany({}).exec()
        ]);
    })
        .catch(console.error);
};
const registerNewUser = () => {
    let admin = new users_model_1.User;
    admin.name = 'Anderson Cruz';
    admin.email = 'andersoncscz@hotmail.com';
    admin.password = '123changeit';
    admin.profiles = ['admin', 'user'];
    return admin.save();
};
const afterAllTests = () => {
    //Shutdown the test server
    return server.shutdown();
};
beforeAllTests()
    .then(() => jest_cli_1.default.run())
    .then(() => afterAllTests())
    .catch(console.error);
