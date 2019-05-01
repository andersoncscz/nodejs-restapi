import 'jest';
import * as request from 'supertest';

import { Server } from '../server/server';
import { environment } from '../common/environment';
import { usersRouter } from './users.router';
import { User } from './users.model';

let server: Server;

beforeAll(() => {
    environment.database.url = process.env.DB_URL || 'mongodb://localhost/node-restapi-test-db'
    environment.server.port = process.env.SERVER_PORT || 80
    server = new Server()
    return server.bootstrap([usersRouter])
                 .then(() => User.deleteMany({}).exec())
                 .catch(console.error)
})



test('get /users', () => {
    return request('http://localhost:80').get('/users').then(response => {
        //Applies matchers:
        expect(response.status).toBe(200); //Tests Status code 200
        expect(response.body.data).toBeInstanceOf(Array); //Tests if the property 'data' of response.body is an array
    })
    .catch(fail)
});



test('post /users', () => {
    return request('http://localhost:80').post('/users')
    .send({
        name: 'user2',
        email: 'user2@hotmail.com',
        password: '123456',
        cpf: '632.494.658-44'
    })
    .then(response => {
        expect(response.status).toBe(200);
        expect(response.body._id).toBeDefined();
        expect(response.body.name).toBe('user2');
        expect(response.body.email).toBe('user2@hotmail.com');
        expect(response.body.cpf).toBe('632.494.658-44');
        expect(response.body.password).toBeUndefined();
    })
    .catch(fail)
});


afterAll(() => {
    return server.shutdown();
})