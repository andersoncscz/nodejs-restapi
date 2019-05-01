"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const request = require("supertest");
const server_1 = require("../server/server");
const environment_1 = require("../common/environment");
const users_router_1 = require("./users.router");
const users_model_1 = require("./users.model");
let server;
beforeAll(() => {
    environment_1.environment.database.url = process.env.DB_URL || 'mongodb://localhost/node-restapi-test-db';
    environment_1.environment.server.port = process.env.SERVER_PORT || 3001;
    server = new server_1.Server();
    return server.bootstrap([users_router_1.usersRouter])
        .then(() => users_model_1.User.remove({}).exec())
        .catch(console.error);
});
test('get /users', () => {
    return request('http://localhost:3001').get('/users').then(response => {
        //Applies matchers:
        expect(response.status).toBe(200); //Tests Status code 200
        expect(response.body.data).toBeInstanceOf(Array); //Tests if the property 'data' of response.body is an array
    })
        .catch(fail);
});
test('post /users', () => {
    return request('http://localhost:3001').post('/users')
        .send({
        name: 'user1',
        email: 'user@hotmail.com',
        password: '123456',
        cpf: '632.494.658-44'
    })
        .then(response => {
        expect(response.status).toBe(200);
        expect(response.body._id).toBeDefined();
        expect(response.body.name).toBe('user1');
        expect(response.body.email).toBe('user@hotmail.com');
        expect(response.body.cpf).toBe('632.494.658-44');
        //expect(response.body.password).toBeUndefined();
    })
        .catch(fail);
});
afterAll(() => {
    //return server.shutdown();
});
