const usersRouter = require('express').Router();
const controller = require('../controllers/app.controller.js');

usersRouter.get('/', controller.getUsers);


module.exports = usersRouter;