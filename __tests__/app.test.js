const app = require('../app.js');
const request = require('supertest');
const db = require('../db/connection.js');
const testData = require('../db/data/test-data');
const seed = require('../db/seeds/seed.js');


afterAll(() => db.end());
beforeEach(() => seed(testData));

describe('# COMMON ERRORS', () => {

    test('404: Path Not Found', () => {
        return request(app)
            .get('/api/invalid_path')
            .expect(404)
            .then(res => {
                expect(res.body.msg).toBe("Path Not Found");
            });
    });
});

describe('# GET REQUESTS', () => {

    describe('GET /api/topics', () => {
        test('200: Returns list of topics', () => {
            return request(app)
                .get('/api/topics')
                .expect(200)
                .then(res => {
                    const topics = res.body.topics;
                    topics.forEach(topic => expect(topic).toMatchObject({
                        slug: expect.any(String),
                        description: expect.any(String)
                    }));
                });
        });
    });
});

describe.only('# PATCH REQUESTS', () => {

    describe('PATCH /api/articles/:article_id', () => {
        test('200: Returns patched article when increasing votes', () => { 
            const patch = {inc_votes: 1};
            return request(app)
                .patch('/api/articles/1')
                .send(patch)
                .expect(200)
                .then(res => {
                    const article = res.body.article;
                    expect(article.article_id).toBe(1);
                    expect(article.votes).toBe(101);
                });
        });
        test('200: Returns patched article when decreasing votes', () => {
            const patch = {inc_votes: -100};
            return request(app)
                .patch('/api/articles/1')
                .send(patch)
                .expect(200)
                .then(res => {
                    const article = res.body.article;
                    expect(article.article_id).toBe(1);
                    expect(article.votes).toBe(0);
                });
        });
    });
});

