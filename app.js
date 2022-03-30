const express = require('express');
const controller = require('./controllers/app.controller.js');
const errors = require('./errors.js');

const app = express();
app.use(express.json());


app.get('/api/topics', controller.getTopics);

app.get('/api/articles', controller.getAllArticles);

app.get('/api/articles/:article_id', controller.getArticle);
app.patch('/api/articles/:article_id', controller.patchArticle);

app.get('/api/articles/:article_id/comments', controller.getCommentsByArticleId);
app.post('/api/articles/:article_id/comments', controller.postCommentByArticleId);

app.get('/api/users', controller.getUsers);

// errors
app.use(errors.pathNotFound);
app.use(errors.customError);
app.use(errors.psql_invalidType);

module.exports = app;