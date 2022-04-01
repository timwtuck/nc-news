const {topicsModel, articlesModel, commentsModel, usersModel} = require('../models/');
const endPoints = require('../endpoints.json');
const errors = require('../errors.js');

/*************************************************
 * GET REQUESTS
 ************************************************/

exports.getApi = (req, res, next) => {

    res.status(200).send({endPoints});
}

exports.getTopics = (req, res, next) => {

    topicsModel.selectTopics()
        .then(topics => {
            res.status(200).send({topics});
        })
        .catch(next);
};

exports.getArticle = (req, res, next) => {

    const {article_id} = req.params;

    articlesModel.selectArticle(article_id)
        .then(article => {
            res.status(200).send({article});
        })
        .catch(next);
}

exports.getAllArticles = (req, res, next) => {

    const {sort_by, order, topic, limit, p} = req.query;

    articlesModel.selectAllArticles(sort_by, order, topic, limit, p)
        .then(articles => {
            res.status(200).send({articles});
        })
        .catch(next);
}

exports.getUsers = (req, res, next) => {

    usersModel.selectUsers()
        .then(users => {
            res.status(200).send({users});
        })
        .catch(next);
}

exports.getUserByUsername = (req, res, next) => {

    const {username} = req.params;

    usersModel.selectUserByUsername(username)
        .then(user => {
            res.status(200).send({user});
        })
        .catch(next);
}

exports.getCommentsByArticleId = (req, res, next) => {

    const {article_id} = req.params;
    
    commentsModel.selectByArticleId(article_id)
        .then(comments => {
            res.status(200).send({comments});
        })
        .catch(next);
}


/*************************************************
 * PATCH REQUESTS
 ************************************************/

exports.patchArticle = (req, res, next) => {

    const {article_id} = req.params;
    const updateObj = req.body;

    articlesModel.updateArticle(article_id, updateObj.inc_votes)
        .then(article => {
            res.status(200).send({article});
            })
        .catch(next);
}

exports.patchCommentById = (req, res, next) => {

    const {comment_id} = req.params;
    const updateObj = req.body;

    commentsModel.updateComment(comment_id, updateObj.inc_votes)
        .then(comment => {
            res.status(200).send({comment});
        })
        .catch(next);
}


/*************************************************
 * POST REQUESTS
 ************************************************/

exports.postArticle = (req, res, next) => {

    const article = req.body;

    articlesModel.insertArticle(article.author, article.title,
        article.topic, article.body)
        .then(article => {
            res.status(201).send({article});
        })
        .catch(next);
}

exports.postCommentByArticleId = (req, res, next) => {

    const {article_id} = req.params;
    const newComment = req.body;

    commentsModel.insertCommentById(article_id, 
        newComment.username, newComment.body)
        .then(comment => {
            res.status(201).send({comment});
        })
        .catch(next);
}



/*************************************************
 * DELETE REQUESTS
 ************************************************/

exports.deleteCommentById = (req, res, next) => {

    const {comment_id} = req.params;

    commentsModel.deleteCommentById(comment_id)
        .then(() => {
            res.status(204).send();
        })
        .catch(next);
}