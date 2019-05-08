import 'jest';
import request from 'supertest';

const testUrl: string = (<any>global).testURL;
const auth: string = (<any>global).auth;


test('get /restaurants', () => {
    return request(testUrl)
        .get('/restaurants')
        .set('Authorization', auth)
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body.data).toBeInstanceOf(Array);
        })
        .catch(fail);
});


test('get /restaurants/aaaa - not found', () => {
    return request(testUrl)
        .get('/restaurants/aaaaa')
        .set('Authorization', auth)
        .then(response => expect(response.status).toBe(404))
        .catch(fail);
});


test('get /restaurants/:id/menu', () => {
    return request(testUrl)
        .post('/restaurants')
        .set('Authorization', auth)
        .send({
            name: 'Restaurant with menu',
            menu: [{
                name: 'Coke',
                price: 5,
            }, {
                name: 'Potato',
                price: 12,                    
            }]
        })
        .then(response => request(testUrl)
                .get(`/restaurants/${response.body._id}/menu`)
                .set('Authorization', auth))
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();
            expect(response.body).toBeInstanceOf(Array);
        })
        .catch(fail);
});


test('post /restaurants', () => {
    return request(testUrl)
    .post('/restaurants')
    .set('Authorization', auth)
    .send({
        name: 'Restaurant test',
        menu: [{
            name: 'Coke',
            price: 5,
        }, {
            name: 'Potato',
            price: 12,                    
        }]
    })
    .then(response => {
        expect(response.status).toBe(200);
        expect(response.body._id).toBeDefined();
        expect(response.body.name).toBe('Restaurant test');
        expect(response.body.menu).toBeInstanceOf(Array);
    })
    .catch(fail);
});


test('put /restaurants/:id', () => {
    return request(testUrl)
        .post('/restaurants')
        .set('Authorization', auth)
        .send({ 
            name: 'RestaurantToBeUpdatedByPut',

        })
        .then(response => request(testUrl)
                .put(`/restaurants/${response.body._id}`)
                .set('Authorization', auth)
                .send({ 
                    name: 'Restaurant updated with PUT method',
                    menu: [{
                        name: 'Coke Diet',
                        price: 5,
                    }, {
                        name: 'Orange Juice',
                        price: 12,                    
                    }]                    
                }))
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body._id).toBeDefined();
            expect(response.body.name).toBe('Restaurant updated with PUT method');
        })
        .catch(fail);
});


test('put /restaurants/:id/menu', () => {
    return request(testUrl)
        .post('/restaurants')
        .set('Authorization', auth)
        .send({ 
            name: 'RestaurantToBeUpdatedByPut',

        })
        .then(response => request(testUrl)
                .put(`/restaurants/${response.body._id}/menu`)
                .set('Authorization', auth)
                .send([{
                        name: 'Coke Diet',
                        price: 5,
                    }, {
                        name: 'Orange Juice',
                        price: 12,                    
                    }, {
                        name: 'French Fries',
                        price: 8,                                            
                    }]                    
                ))
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
        })
        .catch(fail);
});


test('patch /restaurants/:id', () => {
    return request(testUrl)
        .post('/restaurants')
        .set('Authorization', auth)
        .send({ name: 'RestaurantToBeUpdated' })
        .then(response => request(testUrl)
                .patch(`/restaurants/${response.body._id}`)
                .set('Authorization', auth)
                .send({ name: 'Restaurant updated successfully' }))
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body._id).toBeDefined();
            expect(response.body.name).toBe('Restaurant updated successfully');
        })
        .catch(fail);
});


test('del /restaurants/:id', () => {
    return request(testUrl)
        .post('/restaurants')
        .set('Authorization', auth)
        .send({
            name: 'RestaurantToBeDeleted'
        })
        .then(response => request(testUrl)
            .del(`/restaurants/${response.body._id}`)
            .set('Authorization', auth))
        .then(response => expect(response.status).toBe(204))
        .catch(fail);
});
