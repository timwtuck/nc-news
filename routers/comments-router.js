const router = require('express').Router();
const controller = require('../controllers/app.controller.js');


router.delete('/:comment_id', controller.deleteCommentById);

module.exports = router;