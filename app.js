const express = require('express');
const c = require('./controllers/app.controller.js');
const app = express();

app.get('/api/topics', c.getTopics);



module.exports = app;