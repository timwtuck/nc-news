const router = require('express').Router();
const controller = require('../controllers/app.controller.js');

router.delete('/:comment_id', controller.deleteCommentById);

router.route('/')
    .get(controller.getAllArticles)
    .post(controller.postArticle);

router.route('/:article_id')
    .get(controller.getArticle)
    .patch(controller.patchArticle);

router.route('/:article_id/comments')
    .get(controller.getCommentsByArticleId)
    .post(controller.postCommentByArticleId);

module.exports = router;