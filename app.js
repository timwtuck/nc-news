const express = require('express');
const c = require('./controllers/app.controller.js');
const errors = require('./errors.js');

const app = express();
app.use(express.json());

app.get('/api/topics', c.getTopics);

app.get('/api/articles/:article_id', c.getArticles)
app.patch('/api/articles/:article_id', c.patchArticle)

app.get('/api/users', c.getUsers);

app.use(errors.pathNotFound);
app.use(errors.psql_invalidType);


module.exports = app;