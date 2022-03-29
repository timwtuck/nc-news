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
    test('400: Invalid Data Type', () => {
        return request(app)
            .get('/api/articles/not_an_id')
            .expect(400)
            .then(res => {
                expect(res.body.msg).toBe("Invalid Data Type");
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

    describe('GET /api/articles/:article_id', () => {

        test('200: returns article at article_id', () => {
            return request(app)
                .get('/api/articles/1')
                .expect(200)
                .then(res => {
                    const article = res.body.article;

                    expect(article).toMatchObject({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: 1,
                        body: expect.any(String),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        comment_count: 11});
                });
            });

        test('404: ID not found when given valid non-existent id', () => {
            return request(app)
                .get('/api/articles/100000')
                .expect(404)
                .then(res => {
                    console.log(res.body)
                    expect(res.body.msg).toBe("ID not found");
                });
        });
    });     
  
    describe.only('GET /api/users', () => {

          test('200: returns an array of objects with property username', () => {
              return request(app)
                  .get('/api/users')
                  .expect(200)
                  .then(res => {
                      const users = res.body.users;
                      users.forEach(user => {
                          expect(user).toMatchObject({
                              username: expect.any(String)
                          });
                      });
                  });
          });
      });
});



describe('# PATCH REQUESTS', () => {

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

