const express = require('express');
const c = require('./controllers/app.controller.js');
const errors = require('./errors.js');

const app = express();

app.get('/api/topics', c.getTopics);
app.get('/api/articles/:article_id', c.getArticles)

app.use(errors.pathNotFound);

module.exports = app;