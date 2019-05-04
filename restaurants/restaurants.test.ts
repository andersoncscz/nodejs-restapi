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
        .catch(fail)
});