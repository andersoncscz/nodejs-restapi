import 'jest';
import request from 'supertest';

let testUrl: string = (<any>global).testURL;

test('get /restaurants', () => {
    return request(testUrl)
        .get('/restaurants')
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body.data).toBeInstanceOf(Array);
        })
        .catch(fail)
});