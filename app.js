const express = require('express');
const controller = require('./controllers/app.controller.js');
const errors = require('./errors.js');

const app = express();
app.use(express.json());


app.get('/api/topics', controller.getTopics);

app.get('/api/articles/:article_id', controller.getArticle);
app.patch('/api/articles/:article_id', controller.patchArticle);

app.get('/api/articles/:article_id/comments', controller.getCommentsByArticleId);

app.get('/api/users', controller.getUsers);


app.use(errors.pathNotFound);
app.use(errors.customError);
app.use(errors.psql_invalidType);

module.exports = app;