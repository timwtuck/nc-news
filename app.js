const express = require('express');
const controller = require('./controllers/app.controller.js');
const errors = require('./errors.js');
const apiRouter = require('./routers/api-router.js');

const app = express();
app.use(express.json());

// route paths
app.use('/api', apiRouter);

// errors
app.use(errors.pathNotFound);
app.use(errors.customError);
app.use(errors.psql_errors);

module.exports = app;