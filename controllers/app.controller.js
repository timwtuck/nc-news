const {topicsModel, articlesModel, commentsModel, usersModel} = require('../models/');

/*************************************************
 * GET REQUESTS
 ************************************************/

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

exports.getUsers = (req, res, next) => {

    m.selectUsers()
        .then(users => {
            res.status(200).send({users});
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