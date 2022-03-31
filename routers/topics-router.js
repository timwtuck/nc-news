const router = require('express').Router();
const controller = require('../controllers/app.controller.js');

router.get('/', controller.getTopics);

module.exports = router;