import 'jest';
import request from 'supertest';

let testUrl: string = (<any>global).testURL;

test('get /reviews', () => {
    return request(testUrl)
        .get('/reviews')
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body.data).toBeInstanceOf(Array);
        })
        .catch(fail)
});