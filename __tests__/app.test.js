const app = require('../app.js');
const request = require('supertest');
const db = require('../db/connection.js');
const testData = require('../db/data/test-data');
const seed = require('../db/seeds/seed.js');
const endPoints = require('../endpoints.json');

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

    describe('GET /api', () => {
        test('200: Returns all end points', () => {
            return request(app)
                .get('/api')
                .expect(200)
                .then(({body}) => {
                    expect(body.endPoints).toEqual(endPoints);
                });
        });
    })

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

    describe('GET /api/articles', () => {

        test('200: returns all articles', () => {
            return request(app)
                .get('/api/articles?limit=20')
                .expect(200)
                .then(({body}) => {

                    expect(body.articles.length).toBe(12);

                    // check each object has correct properties
                    body.articles.forEach(article => {
                        expect(article).toMatchObject({
                            author: expect.any(String),
                            title: expect.any(String),
                            article_id: expect.any(Number),
                            topic: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            comment_count: expect.any(Number)
                        });
                    });

                    // check in ascending order
                    expect(body.articles).toBeSortedBy('created_at', {descending: true});
                });
        });
        test('200: returns sorted articles (default desc)', () => {
            return request(app)
                .get('/api/articles?sort_by=title&limit=20')
                .expect(200)
                .then(({body}) => {
                    expect(body.articles.length).toBe(12);
                    expect(body.articles).toBeSortedBy('title', {descending:true});
                });
        });
        test('200: returns sorted articles asc', () => {
            return request(app)
                .get('/api/articles?sort_by=created_at&order=asc&limit=20')
                .expect(200)
                .then(({body}) => {
                    expect(body.articles.length).toBe(12);
                    expect(body.articles).toBeSortedBy('created_at', {ascending:true});
                });
        });
        test('200: returns filtered articles', () => {
            return request(app)
                .get('/api/articles?topic=cats')
                .expect(200)
                .then(({body}) => {
                    expect(body.articles.length).toBe(1);
                    expect(body.articles[0].topic).toBe('cats');
                });
        });
        test('200: returns paginated articles (only 5)', () => {
            let p1;
            return request(app)
                .get('/api/articles?sort_by=author&order=asc&limit=5&p=1')
                .expect(200)
                .then(({body}) => {
                    p1 = body.articles;
                    expect(p1.length).toBe(5);
                    expect(p1).toBeSorted('author', {ascending:true});
                    expect(body.total_count).toBe(12);

                    return request(app)
                        .get('/api/articles?sort_by=author&order=asc&limit=5&p=2')
                        .expect(200);
                })
                .then(({body}) => {
                    const p2 = body.articles;
                    expect(p2.length).toBe(5);
                    expect(p2).toBeSortedBy('author', {ascending:true});
                    expect(body.total_count).toBe(12);
                    expect(p1[4].author <= p2[0].author).toBe(true);
                    
                    return request(app)
                        .get('/api/articles?sort_by=author&order=asc&limit=5&p=3')
                        .expect(200);
                })
                .then(({body}) => {
                    expect(body.articles.length).toBe(2);
                    expect(body.total_count).toBe(12);

                    return request(app)
                        .get('/api/articles?sort_by=author&order=asc&limit=5&p=4')
                        .expect(200);
                })
                .then(({body}) => {
                    expect(body.articles.length).toBe(0);
                    expect(body.total_count).toBe(12);
                });
        });
        test('400: invalid sort_by query', () => {
            return request(app)
                .get('/api/articles?sort_by=not_valid_column')
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Invalid Query Item");
                });
        });
        test('400: invalid order query', () => {
            return request(app)
                .get('/api/articles?order=not_valid_value')
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Invalid Query Item");
                });
        });
        test('400: invalid limit query (date type)', () => {
            return request(app)
                .get('/api/articles?limit=not_valid_limit')
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Invalid Data Type");
                });
        });
        test('400: invalid limit query (value)', () => {
            return request(app)
                .get('/api/articles?limit=-1')
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Invalid Query Item");
                });
        });
        test('400: invalid page query (data type)', () => {
            return request(app)
                .get('/api/articles?limit=5&p=not_a_page')
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Invalid Data Type");
                });
        });
        test('400: invalid page query (value)', () => {
            return request(app)
                .get('/api/articles?limit=10&p=-1')
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Invalid Query Item");
                });
        });
        test('404: non-existent topic query', () => {
            return request(app)
                .get('/api/articles?topic=not_a_topic')
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toBe("Query Item Not Found");
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
                    expect(res.body.msg).toBe("ID Not Found");
                });
        });
    });   

    describe('GET /api/articles/:article_id/comments', () => {

        test('200: Returns array of comments for given article_id', () => {
            return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({body}) => {
                    body.comments.forEach(comment => {
                        expect(comment).toMatchObject(
                            {
                                comment_id: expect.any(Number),
                                votes: expect.any(Number),
                                created_at: expect.any(String),
                                author: expect.any(String),
                                body: expect.any(String)
                            }
                        );
                    });

                    expect(body.comments.length).toBe(11);
                });
        });
        test('200: Returns empty array when article_id has no associated comments', () => {
            return request(app)
                .get('/api/articles/2/comments')
                .expect(200)
                .then(({body}) => {
                    expect(body.comments.length).toBe(0);
                });
        });
        
    });

  
    describe('GET /api/users', () => {

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

      describe('GET /api/users/:username', () => {

        test('200: returns username object', () => {
            return request(app)
                .get('/api/users/rogersop')
                .expect(200)
                .then(({body}) => {
                    expect(body.user).toMatchObject({
                            username: 'rogersop',
                            name: 'paul',
                            avatar_url: 'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4'
                    });
                });
        });
        test('404: upon non-existant id', () => {
            return request(app)
                .get('/api/users/not_an_id')
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toBe('ID Not Found');
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
        test('404: ID not found for valid non-existent id', () => {
            const patch = {inc_votes: 1};
            return request(app)
                .patch('/api/articles/99999')
                .send(patch)
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toBe("ID Not Found")
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
        test('400: Invalid object throws bad request', () => {
            const patch = {};
            return request(app)
                .patch('/api/articles/1')
                .send(patch)
                .expect(400)
                .then(res => {
                    expect(res.body.msg).toBe("Invalid Patch Object");
            });
        });
    });

    describe('PATCH /api/comments/:comment_id', () => {

        test('200: returns updated comment with increased votes', () => {
            const patch = {inc_votes: 1};
            return request(app)
                .patch('/api/comments/1')
                .send(patch)
                .expect(200)
                .then(({body}) => {
                    expect(body.comment).toMatchObject({
                        comment_id: 1,
                        article_id: 9,
                        author: 'butter_bridge',
                        votes: 17,
                        created_at: expect.any(String)
                    });
                });   
        });
        test('200: returns updated comment with decreased votes', () => {
            const patch = {inc_votes: -1};
            return request(app)
                .patch('/api/comments/1')
                .send(patch)
                .expect(200)
                .then(({body}) => {
                    expect(body.comment).toMatchObject({
                        comment_id: 1,
                        article_id: 9,
                        author: 'butter_bridge',
                        votes: 15,
                        created_at: expect.any(String)
                    });
                });   
        });
        test('404: ID Not Found for valid non-existent ID', () => {
            const patch = {inc_votes: -1};
            return request(app)
                .patch('/api/comments/100000')
                .send(patch)
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toBe('ID Not Found');
                });   
        });
        test('400: Invalid Patch Object', () => {
            const patch = {};
            return request(app)
                .patch('/api/comments/1')
                .send(patch)
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe('Invalid Patch Object');
                });   
        });
        test('400: Invalid Data Type', () => {
            const patch = {inc_votes: 'wrong_data_type'};
            return request(app)
                .patch('/api/comments/1')
                .send(patch)
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe('Invalid Data Type');
                });   
        });
    });
});

describe('# POST REQUESTS', () => {

    describe('POST /api/articles/:article_id/comments', () => {
        test('201: Posts new comment to article_id', () => {
            const post = {username:'rogersop', body:"This is a comment"};
            return request(app)
                .post('/api/articles/2/comments')
                .send(post)
                .expect(201)
                .then(({body}) => {
                    expect(body.comment).toMatchObject(
                        {
                            comment_id: 19, 
                            author: 'rogersop',
                            body: "This is a comment",
                            article_id: 2,
                            votes: 0,
                            created_at: expect.any(String)
                        }
                    )
                });
        });
        test('400: Invalid Post Object', () => {
            const post = {};
            return request(app)
                .post('/api/articles/2/comments')
                .send(post)
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Invalid Post Object");
                });
        });
        test('400: ID doesn\'t exist', () => {
            return request(app)
                .post('/api/articles/100000/comments')
                .send({username:'rogersop', body:"This is a comment"})
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toBe("ID Not Found");
                });
        })
    });

    describe('POST /api/articles', () => {

        test('201: Returns posted article object with correct properties', () => {
            const post = {
                author: 'rogersop', 
                title:'Another Article',
                body: 'My first cat was called Blackie',
                topic: 'cats'};
            return request(app)
                .post('/api/articles')
                .send(post)
                .expect(201)
                .then(({body}) => {
                    expect(body.article).toMatchObject({
                        article_id: 13,
                        author: 'rogersop', 
                        title:'Another Article',
                        body: 'My first cat was called Blackie',
                        topic: 'cats',
                        created_at: expect.any(String),
                        votes: 0
                    });
                });
        });
        test('400: Empty request ==> Invalid Post Object', () => {
            const post = {};
            return request(app)
                .post('/api/articles')
                .send(post)
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Invalid Post Object");
                });
        });
        test('400: Non-existent Username ==> Invalid Post Object', () => {
            const post = {
                author: 'not_a_username', 
                title:'Another Article',
                body: 'My first cat was called Blackie',
                topic: 'cats'};
            return request(app)
                .post('/api/articles')
                .send(post)
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Invalid Post Object");
                });
        });
        test('400: Non-existent Topic ==> Invalid Post Object', () => {
            const post = {
                author: 'rogersop', 
                title:'Another Article',
                body: 'My first cat was called Blackie',
                topic: 'not_a_topic'};
            return request(app)
                .post('/api/articles')
                .send(post)
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Invalid Post Object");
                });
        });
    });
});

describe('# DELETE REQUESTS', () => {

    describe('DELETE /api/comments/:comment_id', () => {
        test('204: No content returned on successful deletion', () => {
            return request(app)
                .delete('/api/comments/16')
                .expect(204)
                .then(() => {
                    return request(app)
                        .get('/api/articles/6/comments')
                        .expect(200);
                })
                .then(({body}) => {
                    // comment_id = 16 was the only comment for article 6,
                    // check has been deleted
                    expect(body.comments.length).toBe(0);
                });
        });
        test('404: Valid non-existent id', () => {
            return request(app)
                .delete('/api/comments/10000')
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toBe("ID Not Found");
                });
        });
        test('400: Invalid Comment Id', () => {
            return request(app)
                .delete('/api/comments/invalid_id')
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("Invalid Data Type");
                });
        });
    });

});