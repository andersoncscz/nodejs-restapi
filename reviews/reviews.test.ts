import 'jest';
import request from 'supertest';

const testUrl: string = (<any>global).testURL;
const auth: string = (<any>global).auth;

test('get /reviews', () => {
    return request(testUrl)
        .get('/reviews')
        .set('Authorization', auth)
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body.data).toBeInstanceOf(Array);
        })
        .catch(fail);
});



test('get /reviews/aaaa - not found', () => {
    return request(testUrl)
        .get('/reviews/aaaaa')
        .set('Authorization', auth)
        .then(response => expect(response.status).toBe(404))
        .catch(fail);
});

test('post /reviews', () => {
    return new Promise(async (resolve, reject) => {
        try {
            
            let response = await request(testUrl)
                .get('/users?email=andersoncscz@hotmail.com')
                .set('Authorization', auth);
        
            expect(response.body.data).toBeInstanceOf(Array);
            const user = response.body.data[0];


            response = await request(testUrl)
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
                });
            
            const restaurant = response.body;
    
            response = await request(testUrl)
                .post('/reviews')
                .set('Authorization', auth)
                .send({
                    date: '2019-05-08T16:00:00.000Z',
                    rating: 3,
                    comments: 'Comment test',
                    restaurant: restaurant._id,
                    user: user._id,
                });
            
            const review = response.body;                
            
            expect(response.status).toBe(200);
            expect(review._id).toBeDefined();
            expect(review.date).toBe('2019-05-08T16:00:00.000Z');
            expect(review.rating).toBe(3);
            expect(review.comments).toBe('Comment test');
            expect(review.restaurant).toBe(restaurant._id);
            expect(review.user).toBe(user._id);
    
            resolve();
    
        } catch (fail) {
            reject(fail);
        }        
    })
});