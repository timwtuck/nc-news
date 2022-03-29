const express = require('express');
const controller = require('./controllers/app.controller.js');
const errors = require('./errors.js');

const app = express();
app.use(express.json());

app.get('/api/topics', controller.getTopics);

app.get('/api/articles', controller.getAllArticles);

app.get('/api/articles/:article_id', controller.getArticle);
app.patch('/api/articles/:article_id', controller.patchArticle);

app.get('/api/users', controller.getUsers);

app.use(errors.pathNotFound);
app.use(errors.psql_invalidType);
app.use(errors.customError);

module.exports = app;