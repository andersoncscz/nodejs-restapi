import 'jest';
import request from 'supertest';

const testUrl: string = (<any>global).testURL;
const auth: string = (<any>global).auth;

test('get /users', () => {
    return request(testUrl)
        .get('/users')
        .set('Authorization', auth)
        .then(response => {
            //Applies matchers:
            expect(response.status).toBe(200);
            expect(response.body.data).toBeInstanceOf(Array);
        })
        .catch(fail);
});


test('get /users/aaaa - not found', () => {
    return request(testUrl)
        .get('/users/aaaaa')
        .set('Authorization', auth)
        .then(response => expect(response.status).toBe(404))
        .catch(fail);
});


test('get /users/:id', () => {
    return request(testUrl)
        .post('/users')
        .set('Authorization', auth)
        .send({
            name: 'Anderson Cruz 3',
            email: 'andersoncscz3@hotmail.com',
            password: '123456',
            cpf: '632.494.658-44'
        })
        .then(response => request(testUrl)
                .get(`/users/${response.body._id}`)
                .set('Authorization', auth))
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body._id).toBeDefined();
            expect(response.body.name).toBe('Anderson Cruz 3');
            expect(response.body.email).toBe('andersoncscz3@hotmail.com');
            expect(response.body.cpf).toBe('632.494.658-44');
        })
        .catch(fail);
});


test('post /users', () => {
    return request(testUrl)
    .post('/users')
    .set('Authorization', auth)
    .send({
        name: 'Anderson Cruz 2',
        email: 'andersoncscz2@hotmail.com',
        password: '123456',
        cpf: '632.494.658-44'
    })
    .then(response => {
        expect(response.status).toBe(200);
        expect(response.body._id).toBeDefined();
        expect(response.body.name).toBe('Anderson Cruz 2');
        expect(response.body.email).toBe('andersoncscz2@hotmail.com');
        expect(response.body.cpf).toBe('632.494.658-44');
        expect(response.body.password).toBeUndefined();
    })
    .catch(fail);
});



test('post /users/authenticate', () => {
    return request(testUrl)
    .post('/users/authenticate')
    .set('Authorization', auth)
    .send({
        email: 'andersoncscz2@hotmail.com',
        password: '123456',
    })
    .then(response => {
        expect(response.status).toBe(200);
        expect(response.body.accessToken).toBeDefined();
    })
    .catch(fail);
});


test('post /users/authenticate', () => {
    return request(testUrl)
    .post('/users/authenticate')
    .set('Authorization', auth)
    .send({
        email: 'andersoncscz2@hotmail.com',
        password: 'wrong-password',
    })
    .then(response => expect(response.status).toBe(403))
    .catch(fail);
});



test('put /users/:id', () => {
    return request(testUrl)
        .post('/users')
        .set('Authorization', auth)
        .send({ 
            name: 'UserToBeUpdatedByPut',
            email: 'emailbeforeput@hotmail.com',
            password: '123456',
        })
        .then(response => request(testUrl)
                .put(`/users/${response.body._id}`)
                .set('Authorization', auth)
                .send({ 
                    name: 'User updated with PUT method',
                    email: 'emailafterput@hotmail.com',
                    password: 'password-changed',
                }))
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body._id).toBeDefined();
            expect(response.body.name).toBe('User updated with PUT method');
            expect(response.body.email).toBe('emailafterput@hotmail.com');
        })
        .catch(fail);
});


test('patch /users/:id', () => {
    //Tries to add a new user with 'post' and then changes the user name using 'patch'
    return request(testUrl)
        .post('/users')
        .set('Authorization', auth)
        .send({
            name: 'userToBeUpdated',
            email: 'usertobeupdated@hotmail.com',
            password: '123456'
        })
        .then(response => request(testUrl)
                .patch(`/users/${response.body._id}`)
                .set('Authorization', auth)
                .send({
                    name: 'User updated successfully'
                }))
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body._id).toBeDefined();
            expect(response.body.name).toBe('User updated successfully');
            expect(response.body.email).toBe('usertobeupdated@hotmail.com');
            expect(response.body.password).toBeUndefined();
        })
        .catch(fail);
});



test('del /users/:id', () => {
    //Tries to add a new user with 'post' and then deletes it using 'del'
    return request(testUrl)
        .post('/users')
        .set('Authorization', auth)
        .send({
            name: 'userToBeDeleted',
            email: 'usertobedeleted@hotmail.com',
            password: '123456'
        })
        .then(response => request(testUrl)
                .del(`/users/${response.body._id}`)
                .set('Authorization', auth)
        )
        .then(response => expect(response.status).toBe(204))
        .catch(fail);
});
