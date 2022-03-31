const apiRouter = require('express').Router();
const {getApi} = require('../controllers/app.controller.js');
const usersRouter = require('./users-router.js');
const topicsRouter = require('./topics-router.js');
const commentsRouter = require('./comments-router.js');
const articlesRouter = require('./articles-router.js');


apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/topics', topicsRouter);

apiRouter.get('/', getApi);

module.exports = apiRouter;