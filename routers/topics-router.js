const router = require('express').Router();
const controller = require('../controllers/app.controller.js');

router.route('/')
    .get(controller.getTopics)
    .post(controller.postTopic);

module.exports = router;