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
    test('400: Invalid Query Type', () => {
        return request(app)
            .get('/api/articles/not_an_id')
            .expect(400)
            .then(res => {
                expect(res.body.msg).toBe("Invalid Query Type");
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

    describe('GET /api/atricles/:article_id', () => {

        test('200: Returns list of articles', () => {
            return request(app)
                .get('/api/articles/1')
                .expect(200)
                .then(res => {
                    const articles = res.body.articles;
                    articles.forEach(article => {
                        
                        // check object properties
                        expect(article).toMatchObject({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        body: expect.any(String),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number)});
                    });
                });
        });
    });
});