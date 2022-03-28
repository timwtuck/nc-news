const express = require('express');
const c = require('./controllers/app.controller.js');
const errors = require('./errors.js');

const app = express();
app.use(express.json());

app.get('/api/topics', c.getTopics);


app.patch('/api/articles/:article_id', c.patchArticle)

app.use(errors.pathNotFound);

module.exports = app;