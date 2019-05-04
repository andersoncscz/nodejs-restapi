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
        .catch(fail)
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
    .catch(fail)
});


test('get /users/aaaa - not found', () => {
    return request(testUrl)
        .get('/users/aaaaa')
        .set('Authorization', auth)
        .then(response => expect(response.status).toBe(404))
        .catch(fail)
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
                    name: 'changed'
                }))
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body._id).toBeDefined();
            expect(response.body.name).toBe('changed');
            expect(response.body.email).toBe('usertobeupdated@hotmail.com');
            expect(response.body.password).toBeUndefined();
        })
        .catch(fail)
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
        ).then(response => expect(response.status).toBe(204))
        .catch(fail)
});
