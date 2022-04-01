const router = require('express').Router();
const controller = require('../controllers/app.controller.js');


router.route('/:comment_id')
    .patch(controller.patchCommentById)
    .delete(controller.deleteCommentById);

module.exports = router;